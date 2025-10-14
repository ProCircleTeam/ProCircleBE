const {
	generateGoogleCalendarOauthUrl,
	exchangeGoogleTokenAndUpdateDB,
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

module.exports = {calendarOauthUrl, exchangeToken};
