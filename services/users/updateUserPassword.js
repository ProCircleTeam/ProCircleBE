const bcrypt = require("bcrypt");
const { User } = require("../../models");
const {
  NOT_FOUND,
  WRONG_CREDENTIALS,
} = require("../../constants/responseCodes");

/**
 *
 * @description - Updates a user's password service
 * @async
 * @function updateUserPasswordService
 * @param {number} userId - userId
 * @param {string} currentPassword - user old password
 * @param {string} newPassword - user new password
 * @returns {Promise<any>}
 */
const updateUserPasswordService = async (
  userId,
  currentPassword,
  newPassword
) => {
  const userInfo = await User.findByPk(userId, {
    raw: true,
    attributes: ["password"],
  });

  if (userInfo) {
    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      userInfo.password
    );
    if (!isPasswordMatch) return WRONG_CREDENTIALS;

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return User.update(
      {
        password: hashedPassword,
      },
      {
        where: { id: userId },
        returning: true,
        raw: true,
      }
    );
  }
  return NOT_FOUND;
};

module.exports = updateUserPasswordService;
