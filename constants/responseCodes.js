'use strict';

/**
 * Response codes enum constants
 * @readonly
 * @enum {string}
 */
const RES_CODES = {
	NOT_FOUND: 'NOT_FOUND',
	WRONG_CREDENTIALS: 'WRONG_CREDENTIALS',
	NO_GOALS_CREATED: 'NO GOALS',
	OK: 'OK',
	MATCHING_FAILED: 'MATCHING_FAILED',
	GOAL_EXISTS: 'GOAL_EXISTS',
};

// Freeze the object to prevent modifications
Object.freeze(RES_CODES);

module.exports = RES_CODES;
