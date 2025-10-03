/* eslint-disable new-cap */
const router = require('express').Router();
const {
	generic,
	clearDBData,
} = require('../controller/generic_controller');

router.route('/request-otp').post(generic);
router.route('/clear-db').delete(clearDBData);

module.exports = router;
