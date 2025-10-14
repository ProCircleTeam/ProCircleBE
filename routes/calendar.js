/* eslint-disable new-cap */
const {
	calendarOauthUrl,
	exchangeToken,
} = require('../controller/calendar_controller');
const {authenticateToken} = require('../middleware/auth');
const router = require('express').Router();

// Router.route('/google-calendar/availability?userId=<partnerId>').get(authenticateToken, getIndustrySectors);
router.route('/calendar-url').get(authenticateToken, calendarOauthUrl);
router.route('/calendar-oauth-redirect-url').get(exchangeToken);

module.exports = router;
