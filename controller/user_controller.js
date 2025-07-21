const GOAL_STATUS = require("../constants/goalStatus");
const { NOT_FOUND, WRONG_CREDENTIALS } = require("../constants/responseCodes");
const {
  User,
  Industry_Sector,
  AreaOfInterest,
  Sequelize,
  Timezone,
} = require("../models");
const { fetchGoalsService } = require("../services/goals/");
const queryTimeZoneByName = require("../services/users/searchTimezone");
const {
  fetchProfileCompletionStatus,
  updateUserEngagementInfo: updateUserEngagementInfoService,
  updateUserGoalInfo: updateUserGoalInfoService,
  updateUserPersonalInfo: updateUserPersonalInfoService,
  updateUserProfessionalInfo: updateUserProfessionalInfoService,
  fetchAreaOfInterest,
} = require("../services/users/updateProfile");
const updateUserPassword = require("../services/users/updateUserPassword");
const { formatDateString } = require("../utils/dateParser");
const { apiResponse, ResponseStatusEnum } = require("../utils/apiResponse");

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const foundUser = await User.findByPk(id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "timezone_id"],
      },
      include: [
        {
          model: Industry_Sector,
          as: "industry_sector",
        },
        {
          model: AreaOfInterest,
          as: "areaOfInterests",
          through: { attributes: [] },
        },
        {
          model: Timezone,
          as: "timezone",
        },
      ],
    });
    if (!foundUser) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 404,
        message: `Cannot find the user with id ${id}`,
      });
    }

    const result = foundUser.toJSON();

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "User fetched successfully",
      data: result,
    });
  } catch (e) {
    console.error(e);

    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};

const getAreaOfInterests = async (_, res) => {
  try {
    const response = await fetchAreaOfInterest();
    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Area of interests fetched successfully",
      data: response,
    });
  } catch (e) {
    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: `An error occured: ${e}`,
    });
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
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: `The value of status must be either any of this values: ${Object.values(
          GOAL_STATUS
        ).join(", ")}`,
      });
    }

    const queryRes = await fetchGoalsService({
      page,
      limit,
      filter: {
        status: req.query.status,
        startDate,
        endDate,
        show_paired_partners: true,
      },
    });
    const offset = limit * (page - 1);
    const { count, data } = queryRes;
    const pages = Math.ceil(count / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const nextPage = currentPage === pages ? null : currentPage + 1;
    const prevPage = currentPage === 1 ? null : currentPage - 1;

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "User partners fetched successfully",
    });
  } catch (error) {
    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};

const updateUserPersonalInfo = async (req, res) => {
  try {
    const { bio, firstName, lastName, phone, username } = req.body;
    const result = await updateUserPersonalInfoService(req.user.id, {
      bio,
      firstName,
      lastName,
      phone,
      username,
      profilePhoto: req.file ? req.file.path : null,
    });

    if (result === NOT_FOUND) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 404,
        message: "User not found",
      });
    }

    const updatedRow = result[1][0];
    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Personal info updated successfully",
      data: {
        username: updatedRow.username,
        email: updatedRow.email,
        phone: updatedRow.phone_number,
        firstName: updatedRow.first_name,
        lastName: updatedRow.last_name,
        profilePhoto: updatedRow.profile_photo,
        id: updatedRow.id,
      },
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: error.message,
      });
    }

    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: error.message,
    });
  }
};

const updateUserProfessionalInfo = async (req, res) => {
  try {
    const { careerSummary, industrySectorId, jobTitle, yearsOfExperience } =
      req.body;
    const result = await updateUserProfessionalInfoService(req.user.id, {
      careerSummary,
      industrySectorId,
      jobTitle,
      yearsOfExperience,
    });

    if (result === NOT_FOUND) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 404,
        message: "User not found",
      });
    }

    const updatedRow = result[1][0];

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Professional info updated successfully",
      data: {
        careerSummary: updatedRow.career_summary,
        industrySectorId: updatedRow.industry_sector_id,
        jobTitle: updatedRow.job_title,
        yearsOfExperience: updatedRow.years_of_experience,
      },
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: error.message,
      });
    }

    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};

const updateUserGoalInfo = async (req, res) => {
  try {
    const {
      addAreaOfInterests = [],
      removeAreaOfInterests = [],
      longTermGoal,
      preferredAccountabilityPartnerTrait,
    } = req.body;
    const result = await updateUserGoalInfoService(req.user.id, {
      addAreaOfInterests,
      removeAreaOfInterests,
      longTermGoal,
      preferredAccountabilityPartnerTrait,
    });

    if (result === NOT_FOUND) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 404,
        message: "User not found",
      });
    }

    const updatedRow = result[0][1][0];

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Goals and Interest update successfully",
      data: {
        longTermGoal: updatedRow.long_term_goal,
        preferredAccountabilityPartnerTrait:
          updatedRow.preferred_accountability_partner_trait,
        addedAreaOfInterests: addAreaOfInterests,
        removedAreaOfInterests: removeAreaOfInterests,
      },
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: error.message,
      });
    }

    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: error,
    });
  }
};

const updateUserEngagementInfo = async (req, res) => {
  try {
    const { availabilityDays, funFact, timeZone } = req.body;
    const result = await updateUserEngagementInfoService(req.user.id, {
      availabilityDays,
      funFact,
      timeZone,
    });

    if (result === NOT_FOUND) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 404,
        message: "User not found",
      });
    }

    const updatedRow = result[1][0];

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Engagement updated successfully",
      data: {
        availabilityDays: updatedRow.availability_days,
        funFact: updatedRow.fun_fact,
        timeZone: updatedRow.timezone_id,
      },
    });
  } catch (error) {
    if (error instanceof Sequelize.ValidationError) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: error.message,
      });
    }

    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: error,
    });
  }
};

const getProfileCompletionStatus = async (req, res) => {
  try {
    const result = await fetchProfileCompletionStatus(req.user.id);
    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Fetched profile status successfully",
      data: result,
    });
  } catch (error) {
    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: error,
    });
  }
};

const searchTimeZoneByName = async (req, res) => {
  try {
    const result = await queryTimeZoneByName(req.query.tzName);
    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Query results",
      data: result,
    });
  } catch (error) {
    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: error,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "currentPassword & newPassword are required fields",
      });
    }

    if (newPassword.length < 6) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "Password length must be greater than 5",
      });
    }

    const result = await updateUserPassword(
      req.user.id,
      currentPassword,
      newPassword
    );

    if (result === WRONG_CREDENTIALS) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 401,
        message:
          "you have to enter your old password correctly to update your password",
      });
    }

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Password successfully updated",
    });
  } catch (error) {
    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: error,
    });
  }
};

module.exports = {
  getUserById,
  getUsersAndTheirPairedPartners,
  changePassword,
  getProfileCompletionStatus,
  updateUserEngagementInfo,
  updateUserProfessionalInfo,
  updateUserPersonalInfo,
  updateUserGoalInfo,
  searchTimeZoneByName,
  getAreaOfInterests,
};
