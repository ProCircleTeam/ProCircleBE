/* eslint-disable new-cap */
const router = require('express').Router();
const {
	getUserById,
	getUsersAndTheirPairedPartners,
	changePassword,
	getProfileCompletionStatus,
	updateUserEngagementInfo,
	updateUserProfessionalInfo,
	updateUserPersonalInfo,
	updateUserGoalInfo,
	searchTimeZoneByName,
	getAreaOfInterests,
	populateUserData,
	registerFcmToken,
} = require('../controller/user_controller');
const {authenticateToken, checkIfUserIsAdmin} = require('../middleware/auth');
const upload = require('../middleware/upload');

router.route('/seed').post(populateUserData);
router
	.route('/profile/status')
	.get(authenticateToken, getProfileCompletionStatus);
router.route('/search/timezone').get(searchTimeZoneByName);
router
	.route('/users/partners')
	.get(authenticateToken, checkIfUserIsAdmin, getUsersAndTheirPairedPartners);
router
	.route('/profile/personal-info/update')
	.put(
		authenticateToken,
		upload.single('profilePhoto'),
		updateUserPersonalInfo,
	);
router
	.route('/profile/engagement-info/update')
	.put(authenticateToken, updateUserEngagementInfo);
router.route('/fetch/area-of-interests').get(authenticateToken, getAreaOfInterests);
router
	.route('/profile/professional-info/update')
	.put(authenticateToken, updateUserProfessionalInfo);
router
	.route('/profile/goal-info/update')
	.put(authenticateToken, updateUserGoalInfo);
router.route('/:id').get(getUserById);
router.route('/change/password').put(authenticateToken, changePassword);
router.route('/register-fcm-token').put(authenticateToken, registerFcmToken);

module.exports = router;
