const GOAL_STATUS = require("../constants/goalStatus");
const { User } = require("../models");
const {
  fetchUsersAndPairedPartners,
} = require("../services/fetchUsersAlongPartnersPaired");
const { formatDateString } = require("../utils/dateParser");

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const foundUser = await User.findByPk(id);
    if (!foundUser) {
      return res.status(404).json({
        message: `Cannot find the user with id ${id}`,
      });
    }

    const result = foundUser.toJSON();
    delete result.password;
    delete result.deletedAt;

    return res.status(200).json({
      status: "Success",
      data: result,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({});
  }
};

const getUsersAndTheirPairedPartners = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    let startDate = undefined;
    let endDate = undefined;

    if (req.query.startDate) {
      startDate = formatDateString(req.query.startDate);
    }

    if (req.query.endDate) {
      endDate = formatDateString(req.query.endDate);
    }

    if (req.query.status && !Object.values(GOAL_STATUS).includes(req.query.status)) {
      return res.status(400).json({
        status: 'error',
        message: `The value of status must be either any of this values: ${Object.values(GOAL_STATUS).join(", ")}`
      })
    }

    const queryRes = await fetchUsersAndPairedPartners({
      page,
      limit,
      filter: {
        status: req.query.status,
        startDate,
        endDate,
      },
    });
    const offset = limit * (page - 1);
    const { count, data } = queryRes;
    const pages = Math.ceil(count / limit);
    const currentPage = Math.floor(offset / limit) + 1;
    const nextPage = currentPage === pages ? null : currentPage + 1;
    const prevPage = currentPage === 1 ? null : currentPage - 1;
    return res.status(200).json({
      status: "success",
      data: {
        result: data,
        meta: {
          limit,
          pages,
          currentPage,
          nextPage,
          prevPage,
        },
      },
    });
  } catch (error) {
    console.log('ERRR ', error);
    
    return res.status(500).json({
      status: "error",
      error,
    });
  }
};

module.exports = { getUserById, getUsersAndTheirPairedPartners };
