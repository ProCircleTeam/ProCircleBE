const { Sequelize, Goal, User } = require("../../models");
const { Op } = Sequelize;
const GOAL_STATUS = require("../../constants/goalStatus");
const { post } = require("axios");
const getWeekBoundaries = require("../../utils/getWeekBoundaries");
const RES_CODES = require("../../constants/responseCodes");
const { emailQueue, parseEmailJobs } = require("../../utils/emailUtil");

/**
 *
 * @description - Fetches a paginated list of users and their paired partners based on goal relationships.
 * @async
 * @function fetchUsersAndPairedPartners
 * @param {Object} params - The parameters for fetching users.
 * @param {number} [params.page ]- The current page number (1-based).
 * @param {number} [params.limit] - The number of results per page.
 * @param {{status: "in_progress" | "pending" | "completed", show_paired_partners: string, date: string, user_id: string}} [params.filter] - (Optional) filtering logic. \
 * You can filter by the by the status of the goal.
 * The show_paired_partners query params just let the API know if it is to implemnent logic for fetching users alongside their partners
 * made for admin alone.
 * The date filter filters goal of the week and the user_id filters goals of a user
 * @returns {Promise<{ count: number, data: Array<Object> } | Array<Object>}
 */
const fetchGoalsService = async ({ page, limit, filter }) => {
  // If show_psired_partners query param is passed, it fetches all goals that are paired (Admin only)
  let where = filter.show_paired_partners
    ? { paired_with: { [Op.not]: null } }
    : {};

  if (filter.date) {
    const { weekStart } = getWeekBoundaries(filter.date);
    where.week_start = weekStart;
  }
  if (filter.status) {
    where.status = filter.status.toLowerCase();
  }
  if (filter.user_id) {
    where.user_id = filter.user_id;
  }
  // If show_psired_partners query param is passed, it fetches all goals that are paired
  // alongside paired partner details (Admin only)
  if (filter.show_paired_partners) {
    const { count, rows } = await Goal.findAndCountAll({
      where,
      attributes: { exclude: ["user_id", "paired_with", "updatedAt"] },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "email", "phone_number", "username"],
        },
        {
          model: User,
          as: "partner",
          attributes: ["id", "email", "phone_number", "username"],
        },
      ],
      limit,
      offset: limit * (page - 1),
    });
    return {
      count,
      data: rows,
    };
  } else {
    const rows = await Goal.findAll({
      where,
      attributes: { exclude: ["user_id", "paired_with", "updatedAt"] },
      include: {
        model: User,
        as: "user",
        attributes: ["username", "id", "email"],
        nested: true,
      },
    });
    return rows;
  }
};

/**
 *
 * @description - Match users based on their goals
 * @async
 * @function pairGoalsService
 * @param {Object} params - The parameters for fetching users.
 * @param {number} params.date- date to use to get week boundaries
 * @returns {Promise<any>}
 */
const pairGoalsService = async ({ date }) => {
  try {
    const goalsOfTheWeek = await fetchGoalsService({
      filter: {
        status: GOAL_STATUS.PENDING,
        date,
      },
    });

    //   Parse Goals of the week for LLM to process
    const llmModelPayload = {
      users: goalsOfTheWeek.map((item) => ({
        id: item.user.id,
        name: item.user.username,
        goal: item.goals[0],
        email: item.user.email,
      })),
    };

    if (llmModelPayload.users.length) {
      const response = await post(
        "https://goal-matcher-api.onrender.com/match-goals",
        { users: llmModelPayload.users }
      );
      const { pairs } = response;
      const emailJobs = parseEmailJobs(pairs);
      await emailQueue.addBulk(emailJobs);
      return RES_CODES.OK;
    } else {
      return RES_CODES.NO_GOALS_CREATED;
    }
  } catch (error) {
    console.error("API call to the LLM model was not successful");
    return RES_CODES.MATCHING_FAILED;
  }
};

module.exports = { fetchGoalsService, pairGoalsService };
