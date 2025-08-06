const { signup, signin, passwordReset } = require("../controller/auth_controller");
const router = require("express").Router();


router.route("/signup").post(signup);
router.route("/signin").post(signin);
router.route("/reset-password").put(passwordReset);

module.exports = router;    