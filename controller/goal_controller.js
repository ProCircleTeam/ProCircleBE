const { Goal, User } = require("../models");
const { Op } = require("sequelize");

// Helper function to get current week boundaries
const getWeekBoundaries = (date = new Date()) => {
  const currentDate = new Date(date);
  const dayOfWeek = currentDate.getDay();
  const diff = currentDate.getDate() - dayOfWeek;
  
  const weekStart = new Date(currentDate.setDate(diff));
  weekStart.setHours(0, 0, 0, 0);
  
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  weekEnd.setHours(23, 59, 59, 999);
  
  return { weekStart, weekEnd };
};

// Create goal
const createGoal = async (req, res) => {
  try {
    const { goals } = req.body;
    const userId = req.user.id; // Assuming you have auth middleware that sets req.user

    // Validate goals array
    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({
        message: "Goals must be a non-empty array"
      });
    }

    // Validate each goal is a non-empty string
    if (goals.some(goal => typeof goal !== 'string' || goal.trim() === '')) {
      return res.status(400).json({
        message: "All goals must be non-empty strings"
      });
    }

    const { weekStart, weekEnd } = getWeekBoundaries();

    // Check if user already has goals for this week
    const existingGoal = await Goal.findOne({
      where: {
        user_id: userId,
        week_start: weekStart,
        week_end: weekEnd
      }
    });

    if (existingGoal) {
      return res.status(400).json({
        message: "You already have goals set for this week. You can update them if they are still pending."
      });
    }

    // Create new goal
    const newGoal = await Goal.create({
      user_id: userId,
      goals: goals.map(goal => goal.trim()),
      week_start: weekStart,
      week_end: weekEnd,
      status: 'pending'
    });

    return res.status(201).json({
      status: "success",
      message: "Goals created successfully",
      data: newGoal
    });

  } catch (error) {
    console.error('Create goal error:', error);
    return res.status(500).json({
      message: "Server error"
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
    if (!goals || !Array.isArray(goals) || goals.length === 0) {
      return res.status(400).json({
        message: "Goals must be a non-empty array"
      });
    }

    // Validate each goal is a non-empty string
    if (goals.some(goal => typeof goal !== 'string' || goal.trim() === '')) {
      return res.status(400).json({
        message: "All goals must be non-empty strings"
      });
    }

    // Find the goal
    const goal = await Goal.findOne({
      where: {
        id: id,
        user_id: userId
      }
    });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found"
      });
    }

    // Check if goal can be updated (only pending goals)
    if (goal.status !== 'pending') {
      return res.status(400).json({
        message: "Cannot update goals that are in progress or completed"
      });
    }

    // Update the goal
    await goal.update({
      goals: goals.map(goal => goal.trim())
    });

    return res.status(200).json({
      status: "success",
      message: "Goals updated successfully",
      data: goal
    });

  } catch (error) {
    console.error('Update goal error:', error);
    return res.status(500).json({
      message: "Server error"
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
      where: { user_id: userId }
    });

    // Get goals with pagination
    const goals = await Goal.findAll({
      where: { user_id: userId },
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: offset
    });

    const totalPages = Math.ceil(totalGoals / limit);

    return res.status(200).json({
      status: "success",
      data: {
        goals,
        pagination: {
          currentPage: page,
          totalPages,
          totalGoals,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });

  } catch (error) {
    console.error('Get user goals error:', error);
    return res.status(500).json({
      message: "Server error"
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
        user_id: userId
      }
    });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found"
      });
    }

    return res.status(200).json({
      status: "success",
      data: goal
    });

  } catch (error) {
    console.error('Get goal by ID error:', error);
    return res.status(500).json({
      message: "Server error"
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
        user_id: userId
      }
    });

    if (!goal) {
      return res.status(404).json({
        message: "Goal not found"
      });
    }

    // Check if goal can be marked as completed
    if (goal.status === 'completed') {
      return res.status(400).json({
        message: "Goals are already marked as completed"
      });
    }

    // Update status to completed
    await goal.update({
      status: 'completed'
    });

    return res.status(200).json({
      status: "success",
      message: "Goals marked as completed successfully",
      data: goal
    });

  } catch (error) {
    console.error('Mark goals completed error:', error);
    return res.status(500).json({
      message: "Server error"
    });
  }
};

module.exports = {
  createGoal,
  updateGoal,
  getUserGoals,
  getGoalById,
  markGoalsCompleted
};