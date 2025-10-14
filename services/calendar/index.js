/* eslint-disable camelcase */
const {OAuth2Client} = require('google-auth-library');
const PORT = process.env.APP_PORT || 5000;
const baseUrl = process.env.BASE_URL || `http://localhost:${PORT}`;
const redirectUrl = `${baseUrl}/${process.env.GOOGLE_CALENDAR_REDIRECT_URI}`;

console.log(`Redirect url ====> ${redirectUrl}`);

const client = new OAuth2Client(process.env.WEB_CLIENT_ID, '', redirectUrl);

const generateGoogleCalendarOauthUrl = async () => client.generateAuthUrl({
	access_type: 'offline', // Gives refresh token
	prompt: 'consent',
	scope: [
		'https://www.googleapis.com/auth/calendar',
		'https://www.googleapis.com/auth/calendar.events',
		'email',
		'profile',
	],
});

const getUserCalendarAvailability = async () => {
};

const exchangeGoogleToken = async code => {
	const {tokens} = await client.getToken(code);
	client.setCredentials(tokens);

	// Save tokens to DB
	// tokens = { access_token, refresh_token, expiry_date }
	return tokens;
};

module.exports = {
	getUserCalendarAvailability,
	generateGoogleCalendarOauthUrl,
	exchangeGoogleToken,
};
