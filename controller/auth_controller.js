const { User } = require("../models");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const e = require("express");

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;
    if (!email || !password || !username) {
      return res
        .status(400)
        .json({ message: "Username Email and Password are required" });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Password length must be greater than 5" });
    }

    if (username.length < 2) {
      return res
        .status(400)
        .json({ message: "Username length must be greater than 2" });
    }

    const existingUser = await User.findOne({
      where: {
        [Op.or]: [{ email }, { username }],
      },
    });

    if (existingUser)
      return res
        .status(400)
        .json({ message: "Email or username already in use" });

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Email ====> ", email);
    console.log("Password ====> ", password);
    console.log("Username ====> ", username);

    const newUser = await User.create({
      email,
      username,
      password: hashedPassword,
    });

    if (!newUser) {
      return res.status(400).json({ message: "failed to create user" });
    } else {
      const result = newUser.toJSON();
      delete result.password;
      delete result.deletedAt;
      result.token = generateToken({
        id: result.id,
        email: result.email,
      });

      return res.status(201).json({
        status: "success",
        message: "user created successfully",
        data: result,
      });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

const signin = async (req, res) => {
  try {
    const { identifier, password } = req.body;
    if (!identifier || !password) {
      return res
        .status(400)
        .json({
          message:
            "identifier and password are required. The value of the identifier can either be your username or your email",
        });
    }

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: identifier }, { username: identifier }],
      },
    });

    if (!user) {
      return res.status(401).json({ message: "Invalid login credentials" });
    }

    const isPasswordMatch = await bcrypt.compare(password, user.password);
    if (!isPasswordMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = generateToken({ id: user.id, email: user.email });
    const result = user.toJSON();
    delete result.password;
    delete result.deletedAt;
    result.token = token;

    return res.status(200).json({
      status: "Success",
      message: "Login successful",
      data: result,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports = { signup, signin };
