const { Goal } = require("../models");
const GOAL_STATUS = require("../constants/goalStatus");
const { pairGoalsService } = require("../services/goals/");
const RES_CODES = require("../constants/responseCodes");
const getWeekBoundaries = require("../utils/getWeekBoundaries");
const { apiResponse, ResponseStatusEnum } = require("../utils/apiResponse");

// Reusable validation helpers
function isValidGoalsArray(goals) {
  return Array.isArray(goals) && goals.length > 0;
}

function areAllGoalsNonEmptyStrings(goals) {
  return goals.every((goal) => typeof goal === "string" && goal.trim() !== "");
}

// Create goal
const createGoal = async (req, res) => {
  try {
    const { goals } = req.body;
    const userId = req.user.id; // Assuming you have auth middleware that sets req.user

    // Validate goals array
    if (!isValidGoalsArray(goals)) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "Goals must be a non-empty array",
      });
    }

    // Validate each goal is a non-empty string
    if (!areAllGoalsNonEmptyStrings(goals)) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "All goals must be non-empty strings",
      });
    }

    const { weekStart, weekEnd } = getWeekBoundaries();

    // Check if user already has goals for this week
    const existingGoal = await Goal.findOne({
      where: {
        user_id: userId,
        week_start: weekStart,
        week_end: weekEnd,
      },
    });

    if (existingGoal) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message:
          "You already have goals set for this week. You can update them if they are still pending.",
      });
    }

    // Create new goal
    const newGoal = await Goal.create({
      user_id: userId,
      goals: goals.map((goal) => goal.trim()),
      week_start: weekStart,
      week_end: weekEnd,
      status: GOAL_STATUS.PENDING,
    });
    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      data: newGoal,
      statusCode: 200,
      message: "Goals created successfully",
    });
  } catch (error) {
    console.error("Create goal error:", error);

    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};

// Update goal
const updateGoal = async (req, res) => {
  try {
    const { id } = req.params;
    const { goals } = req.body;
    const userId = req.user.id;

    // Validate goals array
    if (!isValidGoalsArray(goals)) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "Goals must be a non-empty array",
      });
    }

    // Validate each goal is a non-empty string
    if (!areAllGoalsNonEmptyStrings(goals)) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "All goals must be non-empty strings",
      });
    }

    // Find the goal
    const goal = await Goal.findOne({
      where: {
        id: id,
        user_id: userId,
      },
    });

    if (!goal) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 404,
        message: "Goal not found",
      });
    }

    // Check if goal can be updated (only pending goals)
    if (goal.status !== "pending") {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "Cannot update goals that are in progress or completed",
      });
    }

    // Update the goal
    await goal.update({
      goals: goals.map((goal) => goal.trim()),
    });

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Goals updated successfully",
      data: goal,
    });
  } catch (error) {
    console.error("Update goal error:", error);

    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};

// Fetch user goals with pagination
const getUserGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Get total count
    const totalGoals = await Goal.count({
      where: { user_id: userId },
    });

    // Get goals with pagination
    const goals = await Goal.findAll({
      where: { user_id: userId },
      order: [["createdAt", "DESC"]],
      limit: limit,
      offset: offset,
    });

    const totalPages = Math.ceil(totalGoals / limit);
    var data = {
      goals,
      pagination: {
        currentPage: page,
        totalPages,
        totalGoals,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
      },
    };

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Goals Fetched successfully",
      data,
    });
  } catch (error) {
    console.error("Get user goals error:", error);
    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};

// Fetch single goal by ID
const getGoalById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const goal = await Goal.findOne({
      where: {
        id: id,
        user_id: userId,
      },
    });

    if (!goal) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 404,
        message: "Goal not found",
      });
    }

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Goal fetched successfully",
      data: goal,
    });
  } catch (error) {
    console.error("Get goal by ID error:", error);

    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};

// Mark goals as completed
const markGoalsCompleted = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Find the goal
    const goal = await Goal.findOne({
      where: {
        id: id,
        user_id: userId,
      },
    });

    if (!goal) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 404,
        message: "Goal not found",
      });
    }

    // Check if goal can be marked as completed
    if (goal.status === GOAL_STATUS.COMPLETED) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "Goals are already marked as completed",
      });
    }

    // Update status to completed
    await goal.update({
      status: GOAL_STATUS.COMPLETED,
    });
    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Goals marked as completed successfully",
      data: goal,
    });
  } catch (error) {
    console.error("Mark goals completed error:", error);
    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};

// Pair Goals controller
const pairGoals = async (req, res) => {
  try {
    const { date } = req.query;
    const result = await pairGoalsService({ date });

    if (result === RES_CODES.NO_GOALS_CREATED)
      return apiResponse({
        res,
        status: ResponseStatusEnum.SUCCESS,
        statusCode: 200,
        message: "No goals were created by users this week!",
      });

    if (result === RES_CODES.MATCHING_FAILED)
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 424,
        message: "The LLM model is having some glitches, try again",
      });

    // send mail to user & partner
    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Users have been successfully matched based on their goals",
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

const getUserGoalsByDate = async (req, res) => {
  try {
    const { date } = req.query; // Expected format: YYYY-MM-DD or any valid date string
    const userId = req.user.id;

    if (!date) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "Date parameter is required",
      });
    }

    const inputDate = new Date(date);
    if (isNaN(inputDate.getTime())) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "Invalid date format. Please provide a valid date",
      });
    }

    const { weekStart, weekEnd } = getWeekBoundaries(inputDate);

    const goal = await Goal.findOne({
      where: {
        user_id: userId,
        week_start: weekStart,
        week_end: weekEnd,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "username", "email"],
        },
        {
          model: User,
          as: "partner",
          attributes: ["id", "username", "email"],
          required: false,
        },
      ],
    });

    if (!goal) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 404,
        message: "No goals found for the week containing the specified date",
        data: {
          requestedDate: date,
          weekStart: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
        },
      });
    }

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Goals retrieved successfully",
      data: {
        goal,
        weekInfo: {
          requestedDate: date,
          weekStart: weekStart.toISOString(),
          weekEnd: weekEnd.toISOString(),
        },
      },
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

module.exports = {
  createGoal,
  updateGoal,
  getUserGoals,
  getGoalById,
  markGoalsCompleted,
  getUserGoalsByDate,
  pairGoals,
};
