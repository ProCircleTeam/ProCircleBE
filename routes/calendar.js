/* eslint-disable new-cap */
const {
	calendarOauthUrl,
	exchangeToken,
	userCalendarBusyPeriod,
	createAccountabilityEvent,
} = require('../controller/calendar_controller');
const {authenticateToken} = require('../middleware/auth');
const router = require('express').Router();

router.route('/busy').get(authenticateToken, userCalendarBusyPeriod);
router.route('/calendar-url').get(authenticateToken, calendarOauthUrl);
router.route('/calendar-oauth-redirect-url').get(exchangeToken);
router
	.route('/accountability-call')
	.post(authenticateToken, createAccountabilityEvent);

module.exports = router;
