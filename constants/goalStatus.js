'use strict';

/**
 * Goal status enum constants
 * @readonly
 * @enum {string}
 */
const GOAL_STATUS = {
	PENDING: 'pending',
	IN_PROGRESS: 'in_progress',
	COMPLETED: 'completed',
};

// Freeze the object to prevent modifications
Object.freeze(GOAL_STATUS);

module.exports = GOAL_STATUS;
