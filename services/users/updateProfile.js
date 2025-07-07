const { NOT_FOUND } = require("../../constants/responseCodes");
const { User } = require("../../models");

/**
 *
 * @description - Updates a user's profile
 * @async
 * @function updateProfileService
 * @param {number} userId - user that wants to update profile
 * @param {{username: string, email: string, phone: string}} data - user data to update
 * @returns {Promise<any>}
 */
const updateProfileService = async (userId, data) => {
  const userInfo = await User.findByPk(userId, { raw: true });
  if (userInfo) {
    return User.update(
      {
        email: data.email || userInfo.email,
        username: data.username || userInfo.username,
        phone_number: data.phone || userInfo.phone_number
      },
      {
        where: { id: userId },
        returning: true,
        raw: true
      }
    );
  }
  return NOT_FOUND;
};

module.exports = updateProfileService;
