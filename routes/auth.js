const { signup } = require("../controller/auth_controller");
const router = require("express").Router();


router.route("/signup").post(signup);

module.exports = router;