/* eslint-disable camelcase */
/* eslint-disable   no-return-await */
/* eslint-disable   @stylistic/no-mixed-operators */
const {OAuth2Client} = require('google-auth-library');
const {User} = require('../../models');
const {google} = require('googleapis');
const PORT = process.env.APP_PORT || 5000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
const redirectUrl = `${baseUrl}/${process.env.GOOGLE_CALENDAR_REDIRECT_URI}`;

console.log(`Redirect url ====> ${redirectUrl}`);

const client = new OAuth2Client(
	process.env.WEB_CLIENT_ID,
	process.env.WEB_CLIENT_SECRET,
	redirectUrl,
);

const generateGoogleCalendarOauthUrl = async userId =>
	client.generateAuthUrl({
		access_type: 'offline', // Gives refresh token
		prompt: 'consent',
		scope: [
			'https://www.googleapis.com/auth/calendar',
			'https://www.googleapis.com/auth/calendar.events',
			'email',
			'profile',
		],
		state: userId,
	});

const getUserCalendarBusyPeriod = async (userId, timeMin, timeMax) => {
	try {
		const auth = new google.auth.OAuth2();
		const user = await User.findByPk(userId);
		if (!user || !user.googleAccessToken) {
			throw new Error('User not found or not connected to Google Calendar');
		}

		auth.setCredentials({access_token: user.googleAccessToken});

		const calendar = google.calendar({version: 'v3', auth});

		const response = await calendar.freebusy.query({
			requestBody: {
				timeMin: timeMin.toISOString(),
				timeMax: timeMax.toISOString(),
				items: [{id: 'primary'}], // User's primary calendar
			},
		});

		// Extract busy periods and TimeZone
		const busyPeriods = response.data.calendars.primary.busy || [];
		const timeZone = response.data.calendars.primary.timeZone || [];

		// BusyPeriods.forEach((period, index) => {
		//   console.log(`Busy period ${index + 1}:`);
		//   console.log("  Start:", period.start);
		//   console.log("  End:", period.end);
		//   console.log(
		//     "  Duration:",
		//     new Date(period.end) - new Date(period.start),
		//     "ms"
		//   );
		//   console.log("  ---");
		// });

		return {busyPeriods, timeZone};
	} catch (error) {
		console.error('Error fetching free/busy data: ================>', error);
		throw error;
	}
};

const exchangeGoogleTokenAndUpdateDB = async (code, userId) => {
	const {tokens} = await client.getToken(code);
	client.setCredentials(tokens);

	// Convert to proper date string for Sequelize
	let expiryDate;
	if (tokens.expiry_date) {
		// Convert timestamp to ISO string
		expiryDate = new Date(tokens.expiry_date).toISOString();
	} else {
		// Default to 1 hour from now
		expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
	}

	const extractedTokens = {
		access_token: tokens.access_token,
		refresh_token: tokens.refresh_token,
		expiry_date: expiryDate,
	};

	await User.update(
		{
			googleAccessToken: extractedTokens.access_token,
			googleRefreshToken: extractedTokens.refresh_token,
			googleAccessTokenExpiry: extractedTokens.expiry_date,
			updatedAt: new Date(),
		},
		{
			where: {id: userId},
		},
	);

	return extractedTokens;
};

const refreshGoogleAccessToken = async userId => {
	try {
		const user = await User.findByPk(userId);
		if (!user || !user.googleRefreshToken) {
			throw new Error('User not found or no refresh token available');
		}

		const auth = new google.auth.OAuth2(
			process.env.WEB_CLIENT_ID,
			process.env.WEB_CLIENT_SECRET,
		);

		const {tokens} = await auth.refreshToken(user.googleRefreshToken);

		let expiryDate;
		if (tokens.expiry_date) {
			expiryDate = new Date(tokens.expiry_date).toISOString();
		} else {
			expiryDate = new Date(Date.now() + 60 * 60 * 1000).toISOString();
		}

		await User.update(
			{
				googleAccessToken: tokens.access_token,
				googleRefreshToken: tokens.refresh_token || user.googleRefreshToken, // Keep old if not provided
				googleTokenExpiry: expiryDate,
				updatedAt: new Date(),
			},
			{where: {id: userId}},
		);

		console.log('Access token refreshed for user:', userId);
		return tokens.access_token;
	} catch (error) {
		console.error('Error refreshing access token:', error);
		throw new Error('Failed to refresh access token. User needs to reauthenticate.');
	}
};

const isTokenExpired = expiryDate => new Date() >= new Date(expiryDate);

const getValidAccessToken = async userId => {
	const user = await User.findByPk(userId);
	if (!user || !user.googleAccessToken) {
		throw new Error('User not connected to Google Calendar');
	}

	// Check if token is expired or about to expire (5 minute buffer)
	if (
		isTokenExpired(new Date(user.googleTokenExpiry).getTime() - 5 * 60 * 1000)
	) {
		console.log('Token expired or about to expire, refreshing...');
		return await refreshGoogleAccessToken(userId);
	}

	return user.googleAccessToken;
};

const createCalendarEvent = async (userId, eventData) => {
	try {
		const accessToken = await getValidAccessToken(userId);

		const auth = new google.auth.OAuth2();
		auth.setCredentials({access_token: accessToken});

		const calendar = google.calendar({version: 'v3', auth});

		const event = {
			summary: eventData.title,
			description: eventData.description,
			start: {
				dateTime: eventData.startTime,
				timeZone: eventData.timeZone || 'UTC',
			},
			end: {
				dateTime: eventData.endTime,
				timeZone: eventData.timeZone || 'UTC',
			},
			attendees: eventData.attendees?.map(email => ({email})) || [],
			reminders: {
				useDefault: false,
				overrides: [
					{method: 'popup', minutes: 15},
					{method: 'email', minutes: 24 * 60}, // 24 hours
				],
			},
			conferenceData: eventData.createMeetLink
				? {
					createRequest: {
						requestId: `meet-${Date.now()}`,
						conferenceSolutionKey: {type: 'hangoutsMeet'},
					},
				}
				: undefined,
		};

		const response = await calendar.events.insert({
			calendarId: 'primary',
			resource: event,
			conferenceDataVersion: eventData.createMeetLink ? 1 : 0,
			sendUpdates: 'all', // Send notifications to attendees
		});

		console.log('Event created:', response.data.htmlLink);
		return response.data;
	} catch (error) {
		console.error('Error creating calendar event:', error);

		// If it's an auth error, try refreshing token once more
		//   if (error.code === 401) {
		// 	console.log('Auth error, attempting token refresh...');
		// 	const newAccessToken = await refreshAccessToken(userId);
		// 	// Retry with new token
		// 	return createCalendarEventWithToken(userId, eventData, newAccessToken);
		//   }

		throw error;
	}
};

// Helper function for retry with specific token
//   const createCalendarEventWithToken = async (userId, eventData, accessToken) => {
// 	const auth = new google.auth.OAuth2();
// 	auth.setCredentials({ access_token: accessToken });

// 	const calendar = google.calendar({ version: 'v3', auth });

// 	const event = { /* same event structure as above */ };

// 	const response = await calendar.events.insert({
// 	  calendarId: 'primary',
// 	  resource: event,
// 	  conferenceDataVersion: eventData.createMeetLink ? 1 : 0,
// 	  sendUpdates: 'all',
// 	});

// 	return response.data;
//   };

module.exports = {
	generateGoogleCalendarOauthUrl,
	exchangeGoogleTokenAndUpdateDB,
	getUserCalendarBusyPeriod,
	refreshGoogleAccessToken,
	isTokenExpired,
	getValidAccessToken,
	createCalendarEvent,
};
