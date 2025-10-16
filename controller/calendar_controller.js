const {
	generateGoogleCalendarOauthUrl,
	exchangeGoogleTokenAndUpdateDB,
	getUserCalendarBusyPeriod,
	createCalendarEvent,
} = require('../services/calendar');
const {apiResponse, ResponseStatusEnum} = require('../utils/apiResponse');

const calendarOauthUrl = async (req, res) => {
	const userId = req.user.id;
	try {
		const calendarUrl = await generateGoogleCalendarOauthUrl(userId);

		return apiResponse({
			res,
			status: ResponseStatusEnum.SUCCESS,
			data: {url: calendarUrl},
			statusCode: 200,
			message: 'Calendar url successfully fetched',
		});
	} catch (e) {
		console.log(`Error generating google calendar url =======================> ${e}`);
		return apiResponse({
			res,
			status: ResponseStatusEnum.FAIL,
			statusCode: 500,
			message: 'Server error',
		});
	}
};

const exchangeToken = async (req, res) => {
	try {
		const {code, state} = req.query;
		const userId = state;

		await exchangeGoogleTokenAndUpdateDB(code, userId);

		return apiResponse({
			res,
			status: ResponseStatusEnum.SUCCESS,
			data: {},
			statusCode: 200,
			message:
        'Google Calendar connected successfully. You can close this tab.',
		});
	} catch (e) {
		console.log(`Error exchanging google token =======================> ${e}`);
		return apiResponse({
			res,
			status: ResponseStatusEnum.FAIL,
			statusCode: 500,
			message: 'Server error',
		});
	}
};

const userCalendarBusyPeriod = async (req, res) => {
	try {
		const {startDate, endDate, userId} = req.query; // ISO string dates

		const data = await getUserCalendarBusyPeriod(
			userId,
			new Date(startDate),
			new Date(endDate),
		);

		console.log(`User busy periods ======================> ${data}`);

		return apiResponse({
			res,
			status: ResponseStatusEnum.SUCCESS,
			data,
			statusCode: 200,
			message: 'User calendar busy period fetched successfully',
		});
	} catch (e) {
		console.log(`Error getting user free periods =======================> ${e}`);
		return apiResponse({
			res,
			status: ResponseStatusEnum.FAIL,
			statusCode: 500,
			message: 'Server error',
		});
	}
};

const createAccountabilityEvent = async (req, res) => {
	try {
		const userId = req.user.id;
		const {
			title,
			description,
			startTime, // ISO string
			endTime, // ISO string
			partnerEmail,
			timeZone = 'UTC',
			createMeetLink = true,
		} = req.body;

		// Validate required fields
		if (!title || !startTime || !endTime || !partnerEmail) {
			return apiResponse({
				res,
				status: ResponseStatusEnum.FAIL,
				statusCode: 400,
				message:
          'Missing required fields: title, startTime, endTime, partnerEmail',
			});
		}

		const eventData = {
			title,
			description: description || `Accountability call with ${partnerEmail}`,
			startTime,
			endTime,
			timeZone,
			createMeetLink,
			attendees: [partnerEmail], // Add partner as attendee
		};

		const createdEvent = await createCalendarEvent(userId, eventData);

		return apiResponse({
			res,
			status: ResponseStatusEnum.SUCCESS,
			data: {
				event: createdEvent,
				meetLink: createdEvent.hangoutLink,
				eventLink: createdEvent.htmlLink,
			},
			statusCode: 201,
			message: 'Accountability event created successfully',
		});
	} catch (error) {
		console.log(`Error creating calendar event =======================> ${error}`);

		let message = 'Failed to create calendar event';
		let statusCode = 500;

		if (error.message.includes('reauthenticate')) {
			message = 'Please reconnect your Google Calendar account';
			statusCode = 401;
		} else if (error.code === 401) {
			message = 'Google Calendar authentication failed';
			statusCode = 401;
		}

		return apiResponse({
			res,
			status: ResponseStatusEnum.FAIL,
			statusCode,
			message,
		});
	}
};

module.exports = {
	calendarOauthUrl,
	exchangeToken,
	userCalendarBusyPeriod,
	createAccountabilityEvent,
};
