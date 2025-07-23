const router = require("express").Router();
const {
  getUserById,
  getUsersAndTheirPairedPartners,
  changePassword,
  getProfileCompletionStatus,
  updateUserEngagementInfo,
  updateUserProfessionalInfo,
  updateUserPersonalInfo,
  updateUserGoalInfo,
  searchTimeZoneByName
} = require("../controller/user_controller");
const { authenticateToken, checkIfUserIsAdmin } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.route("/:id").get(getUserById);
router
  .route("/profile/status")
  .get(authenticateToken, getProfileCompletionStatus);
router
  .route("/search/timezone")
  .get(searchTimeZoneByName);
router
  .route("/users/partners")
  .get(authenticateToken, checkIfUserIsAdmin, getUsersAndTheirPairedPartners);
router
  .route("/profile/personal-info/update")
  .put(authenticateToken, upload.single("profilePhoto"), updateUserPersonalInfo);
router
  .route("/profile/engagement-info/update")
  .put(authenticateToken, updateUserEngagementInfo);
router
  .route("/profile/professional-info/update")
  .put(authenticateToken, updateUserProfessionalInfo);
router
  .route("/profile/goal-info/update")
  .put(authenticateToken, updateUserGoalInfo);
router.route("/change/password").put(authenticateToken, changePassword);

module.exports = router;
