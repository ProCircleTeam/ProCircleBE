const router = require("express").Router();
const {
  createGoal,
  updateGoal,
  getUserGoals,
  getGoalById,
  markGoalsCompleted,
  getUserGoalsByDate
} = require("../controller/goal_controller");

const { authenticateToken } = require("../middleware/auth");

// Create goal
router.route("/").post( authenticateToken,  createGoal);

// Get user goals with pagination
router.route("/").get(authenticateToken, getUserGoals);

// Get single goal by ID
router.route("/:id").get( authenticateToken,  getGoalById);

// Update goal
router.route("/:id").put( authenticateToken, updateGoal);

// Mark goals as completed
router.route("/:id/complete").patch( authenticateToken,  markGoalsCompleted);

// getting goals by date
router.get('/by-date', getUserGoalsByDate);

module.exports = router;