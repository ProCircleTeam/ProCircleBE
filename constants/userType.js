"use strict";

/**
 * Goal status enum constants
 * @readonly
 * @enum {string}
 */
const USER_TYPE = {
  ADMIN: "admin",
  USER: "user",
};

// Freeze the object to prevent modifications
Object.freeze(USER_TYPE);

module.exports = USER_TYPE;
