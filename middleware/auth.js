const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { ADMIN } = require("../constants/userType");
const { apiResponse, ResponseStatusEnum } = require("../utils/apiResponse");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 401,
        message: "No token provided",
      });
    }

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 401,
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 401,
        message: "Invalid token - user not found",
      });
    }

    req.user = {
      id: user.id,
      email: user.email,
      username: user.username,
      type: user.type,
    };

    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 401,
        message: "Invalid token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 401,
        message: "Token expired",
      });
    }

    console.error("Auth middleware error:", error);

    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};

const checkIfUserIsAdmin = async (req, res, next) => {
  if (req.user.type === ADMIN) {
    return next();
  }

  return apiResponse({
    res,
    status: ResponseStatusEnum.FAIL,
    statusCode: 403,
    message: "Only admins can access this endpoint",
  });
};

module.exports = { authenticateToken, checkIfUserIsAdmin };
