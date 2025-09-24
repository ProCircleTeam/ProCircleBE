/* eslint-disable new-cap */
const {signup, signin, passwordReset, signInWithGoogle} = require('../controller/auth_controller');
const router = require('express').Router();

router.route('/signup').post(signup);
router.route('/signin').post(signin);
router.route('/sign-with-google').post(signInWithGoogle);
router.route('/reset-password').put(passwordReset);

module.exports = router;
