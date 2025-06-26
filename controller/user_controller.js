const { User } = require("../models");

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const foundUser = await User.findByPk(id);
    if (!foundUser) {
      return res.status(404).json({
        message: `Cannot find the user with id ${id}`,
      });
    }

    const result = foundUser.toJSON();
    delete result.password;
    delete result.deletedAt;

    return res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({});
  }
};


module.exports = { getUserById }