const router = require("express").Router();
const { getUserById } = require("../controller/user_controller")

router.route("/:id").get(getUserById);

module.exports = router;
