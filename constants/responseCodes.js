"use strict";

/**
 * Response codes enum constants
 * @readonly
 * @enum {string}
 */
const RES_CODES = {
  NOT_FOUND: 'NOT_FOUND',
  WRONG_CREDENTIALS: 'WRONG_CREDENTIALS',
};

// Freeze the object to prevent modifications
Object.freeze(RES_CODES);

module.exports = RES_CODES;