/* eslint-disable new-cap */
const {
	calendarOauthUrl,
	exchangeToken,
	userCalendarBusyPeriod,
} = require('../controller/calendar_controller');
const {authenticateToken} = require('../middleware/auth');
const router = require('express').Router();

router.route('/busy').get(authenticateToken, userCalendarBusyPeriod);
router.route('/calendar-url').get(authenticateToken, calendarOauthUrl);
router.route('/calendar-oauth-redirect-url').get(exchangeToken);

module.exports = router;

