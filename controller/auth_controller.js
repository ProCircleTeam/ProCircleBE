const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { apiResponse, ResponseStatusEnum } = require("../utils/apiResponse");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "Username, Email and Password are required",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "Invalid email format",
      });
    }

    if (password.length < 6) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "Password length must be greater than 5",
      });
    }

    if (username.length < 2) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "Username length must be greater than 2",
      });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser)
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 409,
        message: "Email or username already in use",
      });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    if (!newUser) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "failed to create user",
      });
    } else {
      const result = newUser.toJSON();
      delete result.password;
      delete result.deletedAt;
      result.token = generateToken({
        id: result.id,
        email: result.email,
      });

      return apiResponse({
        res,
        status: ResponseStatusEnum.SUCCESS,
        statusCode: 201,
        message: "user created successfully",
        data: result,
      });
    }
  } catch (err) {
    console.error(err);
    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};

const signin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message:
          "identifier and password are required. The value of the identifier can either be your username or your email",
      });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
      attributes: [
        "username",
        "email",
        "first_name",
        "last_name",
        "password",
        "id",
      ],
    });

    if (!user) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 401,
        message: "Invalid login credentials",
      });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 401,
        message: "Invalid email or password",
      });
    }

    const token = generateToken({ id: user.id, email: user.email });
    const result = user.toJSON();
    delete result.password;
    delete result.deletedAt;
    result.token = token;

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};

module.exports = { signup, signin };
