const { Op } = require("sequelize");
const { Timezone } = require("../../models");

/**
 * @description - filter timezone where the the value of the query argument is 
 * contained in the Timezone name or the abbreviation column
 * @param {string} query - query value
 * @returns {Promise} - Sequelize Query Promise
 */
const queryTimeZoneByName = (query) => {
  return query
    ? Timezone.findAll({
        raw: true,
        where: {
          [Op.or]: [
            {
              name: {
                [Op.iLike]: `%${query}%`,
              },
            },
            {
              abbreviation: {
                [Op.iLike]: `%${query}%`,
              },
            },
          ],
        },
      })
    : Timezone.findAll();
};

module.exports = queryTimeZoneByName;
