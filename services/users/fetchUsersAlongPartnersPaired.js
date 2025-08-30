/* eslint-disable camelcase */
const {Sequelize, Goal, User} = require('../../models');
const {Op} = Sequelize;

/**
 *
 * @description - Fetches a paginated list of users and their paired partners based on goal relationships.
 * @async
 * @function fetchUsersAndPairedPartners
 * @param {Object} params - The parameters for fetching users.
 * @param {number} params.page - The current page number (1-based).
 * @param {number} params.limit - The number of results per page.
 * @param {{status: "in_progress" | "pending" | "completed", startDate: string, endDate: string}} [params.filter] - (Optional) filtering logic. \
 * You can filter by the date goal was created or by the status of the goal
 * @returns {Promise<{ count: number, data: Array<Object> }>}
 */

const fetchUsersAndPairedPartners = async ({page, limit, filter}) => {
	const where = {paired_with: {[Op.not]: null}};
	if (filter.startDate) {
		where.createdAt = {
			...where.createdAt,
			[Op.gte]: filter.startDate,
		};
	}

	if (filter.endDate) {
		where.createdAt = {
			...where.createdAt,
			[Op.lte]: filter.endDate,
		};
	}

	if (filter.status) {
		where.status = filter.status.toLowerCase();
	}

	const {count, rows} = await Goal.findAndCountAll({
		where,
		attributes: {exclude: ['user_id', 'paired_with', 'updatedAt']},
		include: [
			{
				model: User,
				as: 'user',
				attributes: ['id', 'email', 'phone_number', 'username'],
			},
			{
				model: User,
				as: 'partner',
				attributes: ['id', 'email', 'phone_number', 'username'],
			},
		],
		limit,
		offset: limit * (page - 1),
	});
	return {
		count,
		data: rows,
	};
};

module.exports = {fetchUsersAndPairedPartners};
