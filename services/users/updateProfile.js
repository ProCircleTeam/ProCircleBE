const { NOT_FOUND } = require("../../constants/responseCodes");
const { User, sequelize } = require("../../models");

/**
 *
 * @description - Updates a user's profile
 * @async
 * @function updateProfileService
 * @param {number} userId - user that wants to update profile
 * @param {{
 * username: string,
 * email: string,
 * phone: string,
 * firstName: string,
 * lastName: string,
 * profilePhoto: string,
 * bio: string,
 * jobTitle: string,
 * yearsOfExperience: string,
 * longTermGoal: string,
 * preferredAccountabilityPartnerTrait: string,
 * availabilityDays: Array<string>,
 * timeZone: string,
 * funFact: string,
 * careerSummary: string,
 * industrySectorId: string,
 * addAreaOfInterests: Array<string>,
 * removeAreaOfInterests: Array<string>,
 * }} data - user data to update
 * @returns {Promise<any>}
 */
const updateProfileService = async (userId, data) => {
  let t;
  try {
    t = await sequelize.transaction();
    const userInfo = await User.findByPk(userId, { transaction: t });
    const queryArray = [];
    if (userInfo) {
      const updatedFields = {
        username: data.username ?? userInfo.username,
        phone_number: data.phone ?? userInfo.phone_number,
        first_name: data.firstName ?? userInfo.first_name,
        last_name: data.lastName ?? userInfo.last_name,
        profile_photo: data.profilePhoto ?? userInfo.profile_photo,
        bio: data.bio ?? userInfo.bio,
        job_title: data.jobTitle ?? userInfo.job_title,
        years_of_experience: data.yearsOfExperience ?? userInfo.years_of_experience,
        long_term_goal: data.longTermGoal ?? userInfo.long_term_goal,
        preferred_accountability_partner_trait:
          data.preferredAccountabilityPartnerTrait ??
          userInfo.preferred_accountability_partner_trait,
        availability_days: data.availabilityDays ?? userInfo.availability_days,
        time_zone: data.timeZone ?? userInfo.time_zone,
        fun_fact: data.funFact ?? userInfo.fun_fact,
        career_summary: data.careerSummary ?? userInfo.career_summary,
        industry_sector_id: data.industrySectorId ?? userInfo.industry_sector_id,
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
      return result[0];
    }
    return NOT_FOUND;
  } catch (err) {
    await t.rollback();
    throw err;
  }
};

module.exports = updateProfileService;
