/* eslint-disable new-cap */
const router = require('express').Router();
const {
	generic,
} = require('../controller/generic_controller');

router.route('/request-otp').post(generic);

module.exports = router;
