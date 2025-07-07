const GOAL_STATUS = require("../constants/goalStatus");
const { NOT_FOUND, WRONG_CREDENTIALS } = require("../constants/responseCodes");
const { User, Sequelize } = require("../models");
const {
  fetchUsersAndPairedPartners,
} = require("../services/users/fetchUsersAlongPartnersPaired");
const updateProfileService = require("../services/users/updateProfile");
const updateUserPassword = require("../services/users/updateUserPassword");
const { formatDateString } = require("../utils/dateParser");

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

const getUsersAndTheirPairedPartners = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    let startDate = undefined;
    let endDate = undefined;

    if (req.query.startDate) {
      startDate = formatDateString(req.query.startDate);
    }

    if (req.query.endDate) {
      endDate = formatDateString(req.query.endDate);
    }

    if (
      req.query.status &&
      !Object.values(GOAL_STATUS).includes(req.query.status.toLowerCase())
    ) {
      return res.status(400).json({
        status: "error",
        message: `The value of status must be either any of this values: ${Object.values(
          GOAL_STATUS
        ).join(", ")}`,
      });
    }

    const queryRes = await fetchUsersAndPairedPartners({
      page,
      limit,
      filter: {
        status: req.query.status,
        startDate,
        endDate,
      },
    });
    const offset = limit * (page - 1);
    const { count, data } = queryRes;
    const pages = Math.ceil(count / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const nextPage = currentPage === pages ? null : currentPage + 1;
    const prevPage = currentPage === 1 ? null : currentPage - 1;
    return res.status(200).json({
      status: "success",
      data: {
        result: data,
        meta: {
          limit,
          pages,
          currentPage,
          nextPage,
          prevPage,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

const updateUserProfile = async (req, res) => {
  try {
    const { email, username, phone } = req.body;
    const result = await updateProfileService(req.user.id, {
      email,
      username,
      phone,
    });

    if (result === NOT_FOUND) {
      return res.status(404).json({
        status: "error",
        message: "User not found",
      });
    }

    const updatedRow = result[1][0];
    return res.status(200).json({
      status: "success",
      data: {
        username: updatedRow.username,
        email: updatedRow.email,
        phone: updatedRow.phone_number,
        id: updatedRow.id,
      },
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return res.status(400).json({
        status: "error",
        error: error.message,
      });
    }
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        status: "error",
        message: "currentPassword & newPassword are required fields",
      });
    }

    if (newPassword.length < 6) {
      return res
        .status(400)
        .json({ message: "Password length must be greater than 5" });
    }

    const result = await updateUserPassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    if (result === WRONG_CREDENTIALS) {
      return res.status(401).json({
        status: "error",
        message: "you have to enter your old password correctly to update your password"
      });
    }

    return res.status(200).json({
      status: "success",
      message: "Password successfully updated"
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

module.exports = {
  getUserById,
  getUsersAndTheirPairedPartners,
  updateUserProfile,
  changePassword,
};
