const router = require("express").Router();
const {
  getUserById,
  getUsersAndTheirPairedPartners,
  updateUserProfile,
  changePassword,
} = require("../controller/user_controller");
const { authenticateToken, checkIfUserIsAdmin } = require("../middleware/auth");

router.route("/:id").get(getUserById);
router
  .route("/users/partners")
  .get(authenticateToken, checkIfUserIsAdmin, getUsersAndTheirPairedPartners);
router.route("/profile/update").put(authenticateToken, updateUserProfile);
router.route("/change/password").put(authenticateToken, changePassword);

module.exports = router;
