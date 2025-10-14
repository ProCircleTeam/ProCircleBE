/* eslint-disable camelcase */
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

	const extractedTokens = {
		access_token: tokens.access_token,
		refresh_token: tokens.refresh_token,
		expiry_date: tokens.expiry_date,
	};

	await User.update(
		{
			googleAccessToken: extractedTokens.access_token,
			googleRefreshToken: extractedTokens.refresh_token,

			updatedAt: new Date(),
		},
		{
			where: {id: userId},
		},
	);

	return extractedTokens;
};

module.exports = {
	generateGoogleCalendarOauthUrl,
	exchangeGoogleTokenAndUpdateDB,
	getUserCalendarBusyPeriod,
};
