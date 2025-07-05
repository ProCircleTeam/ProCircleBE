const router = require("express").Router();
const { getUserById, getUsersAndTheirPairedPartners } = require("../controller/user_controller")
const {authenticateToken, checkIfUserIsAdmin} = require("../middleware/auth")

router.route("/:id").get(getUserById);
router.route("/users/partners").get(authenticateToken, checkIfUserIsAdmin, getUsersAndTheirPairedPartners)

module.exports = router;
