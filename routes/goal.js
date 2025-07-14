const router = require("express").Router();
const {
  createGoal,
  updateGoal,
  getUserGoals,
  getGoalById,
  markGoalsCompleted,
  getUserGoalsByDate,
  pairGoals
} = require("../controller/goal_controller");

const { authenticateToken, checkIfUserIsAdmin } = require("../middleware/auth");

// Create goal
router.route("/").post( authenticateToken,  createGoal);

// Get user goals with pagination
router.route("/").get(authenticateToken, getUserGoals);

// getting goals by date
router.route('/by-date').get(authenticateToken, getUserGoalsByDate);

// Get single goal by ID
router.route("/:id").get( authenticateToken,  getGoalById);

// Update goal
router.route("/:id").put( authenticateToken, updateGoal);

// Mark goals as completed
router.route("/:id/complete").patch( authenticateToken,  markGoalsCompleted);

// Pair Goals
router
  .route("/pair/user")
  .get(authenticateToken, checkIfUserIsAdmin, pairGoals);

module.exports = router;