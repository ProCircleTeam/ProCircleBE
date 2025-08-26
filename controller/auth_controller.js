const {
  User,
  Industry_Sector,
  AreaOfInterest,
  Timezone,
} = require("../models");
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
    const { email, password, username, agreeToTermsAndConditions } = req.body;
    if (!agreeToTermsAndConditions) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 400,
        message: "You must agree to the terms and conditions, check it out via https://google.com",
      });

    }
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
      terms_and_conditions_agreement: true
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

      result["phone_number"] = null;
      result["first_name"] = null;
      result["last_name"] = null;
      result["profile_photo"] = null;
      result["bio"] = null;
      result["years_of_experience"] = null;
      result["preferred_accountability_partner_trait"] = null;
      result["fun_fact"] = null;
      result["career_summary"] = null;
      result["industry_sector_id"] = null;
      result["industry_sector"] = null;
      result["areaOfInterests"] = null;
      result["timezone"] = null;

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

    const foundUser = await User.findByPk(user.id, {
      attributes: {
        exclude: ["password", "createdAt", "updatedAt", "timezone_id"],
      },
      include: [
        {
          model: Industry_Sector,
          as: "industry_sector",
        },
        {
          model: AreaOfInterest,
          as: "areaOfInterests",
          through: { attributes: [] },
        },
        {
          model: Timezone,
          as: "timezone",
        },
      ],
    });
    if (!foundUser) {
      return apiResponse({
        res,
        status: ResponseStatusEnum.FAIL,
        statusCode: 404,
        message: `Cannot find the user with id ${id}`,
      });
    }

    const result = foundUser.toJSON();
    const token = generateToken({ id: user.id, email: user.email });
    result.token = token;

    return apiResponse({
      res,
      status: ResponseStatusEnum.SUCCESS,
      statusCode: 200,
      message: "User fetched successfully",
      data: result,
    });
  } catch (err) {
    console.error("Error starts here ====> ");
    console.error(err);
    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 500,
      message: "Server error",
    });
  }
};
const passwordReset = async (req, res) => {
  let error = "";

  if (!req.body || !req.body.email || !req.body.password || !req.body.otp) {

    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 400,
      message: `Email, Password and Otp code are required`,
    });
  }



  const { email, password, otp } = req.body;

  console.log(email);
  console.log(password);
  console.log(otp);
  if (!email) {
    error = "Email is required";
  } else if (!password) {
    error = "Password";
  } else if (!otp) {
    error = "OTP is required";
  }
  if (error)
    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 400,
      message: error,
    });

  const user = await User.findOne({ where: { email } });
  if (!user ||
    user.resetCode !== otp ||
    user.resetCodeExpiration < new Date()) {

    return apiResponse({
      res,
      status: ResponseStatusEnum.FAIL,
      statusCode: 400,
      message: `Invalid or expired code`,
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await user.update({
    password: hashedPassword,
    resetCode: null,
    resetCodeExpiration: null,
  });

  return apiResponse({
    res,
    status: ResponseStatusEnum.SUCCESS,
    statusCode: 200,
    message: `Password reset successful`,
    data: {},
  })

};

module.exports = { signup, signin, passwordReset };
