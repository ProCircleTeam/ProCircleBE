/* eslint-disable new-cap */
const {getUserNotifications} = require('../controller/notification');
const {authenticateToken} = require('../middleware/auth');
const router = require('express').Router();

router.route('/').get(authenticateToken, getUserNotifications);

module.exports = router;
