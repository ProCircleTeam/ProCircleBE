const jwt = require("jsonwebtoken");
const { User } = require("../models");

const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Access token required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user
    const user = await User.findByPk(decoded.id);
    if (!user) {
      return res.status(401).json({
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
      return res.status(401).json({
        message: "Invalid token",
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired",
      });
    }

    console.error("Auth middleware error:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
};

const checkIfUserIsAdmin = async (req, res, next) => {
  if (req.user.type.toUpperCase() === "ADMIN") {
    return next();
  }
  return res.status(403).json({
    message: "Only admins can access this endpoint",
  });
};

module.exports = { authenticateToken, checkIfUserIsAdmin };
