/* eslint-disable new-cap */
const router = require('express').Router();
const {
	generic,
	clearDBData,
	retrieveAugmentedAnswer,
} = require('../controller/generic_controller');

router.route('/request-otp').post(generic);
router.route('/clear-db').delete(clearDBData);
router.route('/text-rag').post(retrieveAugmentedAnswer);

module.exports = router;
