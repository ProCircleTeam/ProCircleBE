const dayjs = require("dayjs");

/**
 * @description - Parse date string argument into a specified format or return null if invalid date string is passed
 * @param {string} dateStr - date string to parse
 * @param {string} [dateFormat="YYYY-MM-DD"]
 * @returns {string | null} - returns parsed date as a string or null if argument is not a valid date
 */
function formatDateString(dateStr, dateFormat="YYYY-MM-DD") {
  const parsed = dayjs(dateStr);

  if (!parsed.isValid()) {
    return null;
  }

  return parsed.format(dateFormat);
}

module.exports = { formatDateString };
