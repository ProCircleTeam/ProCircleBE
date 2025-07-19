const { Op } = require("sequelize");
const { NOT_FOUND } = require("../../constants/responseCodes");
const { User, UserAreaOfInterest, sequelize } = require("../../models");

/**
 *
 * @description - Updates personal info section of the user's profile
 * @async
 * @function updateUserPersonalInfo
 * @param {number} userId - user that wants to update profile
 * @param {{
 * username: string,
 * phone: string,
 * firstName: string,
 * lastName: string,
 * bio: string
 * }} data - user data to update
 * @returns {Promise<any>}
 */
const updateUserPersonalInfo = async (userId, data) => {
  
  const userInfo = await User.findByPk(userId);
  if (userInfo) {
    const updatedFields = {
      username: data.username ?? userInfo.username,
      phone_number: data.phone ?? userInfo.phone_number,
      first_name: data.firstName ?? userInfo.first_name,
      last_name: data.lastName ?? userInfo.last_name,
      profile_photo: data.profilePhoto ?? userInfo.profile_photo,
      bio: data.bio ?? userInfo.bio,
    };
    return User.update(updatedFields, {
      where: { id: userId },
      returning: true,
      raw: true,
    });
  }
  return NOT_FOUND;
};

/**
 *
 * @description - Updates professional info section of the user's profile
 * @async
 * @function updateUserProfessionalInfo
 * @param {number} userId - user that wants to update profile
 * @param {{
 * jobTitle: string,
 * yearsOfExperience: string,
 * careerSummary: string,
 * industrySectorId: string,
 * }} data - user data to update
 * @returns {Promise<any>}
 */
const updateUserProfessionalInfo = async (userId, data) => {
  const userInfo = await User.findByPk(userId);
  if (userInfo) {
    const updatedFields = {
      job_title: data.jobTitle ?? userInfo.job_title,
      years_of_experience:
        data.yearsOfExperience ?? userInfo.years_of_experience,
      career_summary: data.careerSummary ?? userInfo.career_summary,
      industry_sector_id: data.industrySectorId ?? userInfo.industry_sector_id,
    };
    return User.update(updatedFields, {
      where: { id: userId },
      returning: true,
      raw: true,
    });
  }
  return NOT_FOUND;
};

/**
 *
 * @description - Updates engagement info section of the user's profile
 * @async
 * @function updateUserEngagementInfo
 * @param {number} userId - user that wants to update profile
 * @param {{
 * availabilityDays: Array<string>,
 * timeZone: string,
 * funFact: string,
 * }} data - user data to update
 * @returns {Promise<any>}
 */
const updateUserEngagementInfo = async (userId, data) => {
  const userInfo = await User.findByPk(userId);
  if (userInfo) {
    const updatedFields = {
      availability_days: data.availabilityDays ?? userInfo.availability_days,
      timezone_id: data.timeZone ?? userInfo.timezone_id,
      fun_fact: data.funFact ?? userInfo.fun_fact,
    };
    return User.update(updatedFields, {
      where: { id: userId },
      returning: true,
      raw: true,
    });
  }
  return NOT_FOUND;
};

/**
 *
 * @description - Updates goal info section of the user's profile
 * @async
 * @function updateUserGoalInfo
 * @param {number} userId - user that wants to update profile
 * @param {{
 * longTermGoal: string,
 * preferredAccountabilityPartnerTrait: string,
 * addAreaOfInterests: Array<string>,
 * removeAreaOfInterests: Array<string>,
 * }} data - user data to update
 * @returns {Promise<any>}
 */
const updateUserGoalInfo = async (userId, data) => {
  let t;

  try {
    t = await sequelize.transaction();
    const userInfo = await User.findByPk(userId, { transaction: t });
    const queryArray = [];

    if (userInfo) {
      const updatedFields = {
        long_term_goal: data.longTermGoal ?? userInfo.long_term_goal,
        preferred_accountability_partner_trait:
          data.preferredAccountabilityPartnerTrait ??
          userInfo.preferred_accountability_partner_trait,
      };

      queryArray.push(
        User.update(updatedFields, {
          where: { id: userId },
          returning: true,
          raw: true,
          transaction: t,
        })
      );

      if (data.addAreaOfInterests.length) {
        queryArray.push(
          userInfo.addAreaOfInterests(data.addAreaOfInterests, {
            transaction: t,
          })
        );
      }

      if (data.removeAreaOfInterests.length) {
        queryArray.push(
          userInfo.removeAreaOfInterests(data.removeAreaOfInterests, {
            transaction: t,
          })
        );
      }

      const result = await Promise.all(queryArray);
      await t.commit();
      return result;
    }
    return NOT_FOUND;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

/**
 * @description - Checks what sections of the profile is fully updated
 * @param {number} userId - user that wants to update profile
 * @returns {Promise<any>} - return Promise
 */
const fetchProfileCompletionStatus = async (userId) => {
  const personalInfoFilter = {
    email: { [Op.ne]: null },
    phone_number: { [Op.ne]: null },
    username: { [Op.ne]: null },
    first_name: { [Op.ne]: null },
    last_name: { [Op.ne]: null },
    profile_photo: { [Op.ne]: null },
    bio: { [Op.ne]: null },
    id: userId,
  };

  const professionalInfoFilter = {
    job_title: { [Op.ne]: null },
    industry_sector_id: { [Op.ne]: null },
    years_of_experience: { [Op.ne]: null },
    career_summary: { [Op.ne]: null },
    id: userId,
  };

  const goalInfoFilter = {
    long_term_goal: { [Op.ne]: null },
    preferred_accountability_partner_trait: { [Op.ne]: null },
    id: userId,
  };

  const engagementInfoFilter = {
    availability_days: { [Op.ne]: null },
    timezone_id: { [Op.ne]: null },
    fun_fact: { [Op.ne]: null },
    id: userId,
  };

  const personalInfo = User.findOne({
    where: personalInfoFilter,
    raw: true,
    attributes: [
      "email",
      "phone_number",
      "username",
      "first_name",
      "last_name",
      "profile_photo",
      "bio",
    ],
  });

  const professionalInfo = User.findOne({
    where: professionalInfoFilter,
    raw: true,
    attributes: [
      "job_title",
      "years_of_experience",
      "industry_sector_id",
      "career_summary",
    ],
  });
  const goalsInfo = User.findOne({
    where: goalInfoFilter,
    raw: true,
    attributes: ["long_term_goal", "preferred_accountability_partner_trait"],
  });
  const areaOfInterestsInfo = UserAreaOfInterest.findOne({
    raw: true,
    where: {
      user_id: userId,
    },
  });
  const engagementInfo = User.findOne({
    raw: true,
    where: engagementInfoFilter,
    attributes: ["availability_days", "timezone_id", "fun_fact"],
  });

  const [
    personalInfoData,
    professionalInfoData,
    goalsInfoData,
    areaOfInterestsInfoData,
    engagementInfoData,
  ] = await Promise.all([
    personalInfo,
    professionalInfo,
    goalsInfo,
    areaOfInterestsInfo,
    engagementInfo,
  ]);
  return {
    personalInfoComplete: Boolean(personalInfoData),
    professionalInfoComplete: Boolean(professionalInfoData),
    goalsInfoComplete: Boolean(goalsInfoData) && Boolean(areaOfInterestsInfoData),
    engagementInfoComplete: Boolean(engagementInfoData),
  };
};

module.exports = {
  fetchProfileCompletionStatus,
  updateUserPersonalInfo,
  updateUserProfessionalInfo,
  updateUserEngagementInfo,
  updateUserGoalInfo,
};
