/* eslint-disable camelcase */
const bcrypt = require('bcrypt');
const {User, Goal, AreaOfInterest, IndustrySector, Timezone, sequelize} = require('../../models');
const getWeekBoundaries = require('../../utils/getWeekBoundaries');
const GOAL_STATUS = require('../../constants/goalStatus');

async function populateUserDataService(username, email, firstName, lastName) {
	let t;

	const hashedPassword = await bcrypt.hash('password', 10);
	try {
		t = await sequelize.transaction();

		// Const lastUserId = await User.max('id');

		const technologyIndustrySector = await IndustrySector.findOne({
			where: {
				name: 'Technology',
			},
			raw: true,
		});

		const timeZone = await Timezone.findOne({
			where: {
				abbreviation: 'WAT',
			},
			attributes: ['id'],
			raw: true,
		});

		const userData = await User.create({
			email,
			password: hashedPassword,
			username,
			phone_number: '+16794004880',
			first_name: firstName || 'Nature',
			last_name: lastName || 'Ex',
			profile_photo: 'https://img.icons8.com/ios-filled/150/000000/user-male-circle.png',
			bio: 'Creator of Nature AI',
			terms_and_conditions_agreement: true,
			job_title: 'Engineer',
			years_of_experience: 6,
			career_summary: 'Creator of popular AI platforms',
			industry_sector_id: technologyIndustrySector.id,
			availability_days: ['MON - 9AM', 'TUE - 10PM', 'SUN - 11PM'],
			timezone_id: timeZone.id,
			fun_fact: 'I like playing board games',
			long_term_goal: 'To be a successful father and an accomplished engineer',
			preferred_accountability_partner_trait: 'Dedicated to Excellence, disciplined & punctual',
		}, {transaction: t});

		const areaOfInterests = await AreaOfInterest.findAll({
			limit: 3,
			raw: true,
			attributes: ['id'],
		});

		const addUserAreaOfInterest = userData.addAreaOfInterests(areaOfInterests.map(item => item.id), {transaction: t});

		const {weekStart, weekEnd} = getWeekBoundaries();

		const goals = [
			'Start Prayer Session',
			'Start Coding School',
			'Start Dating app',
		];

		const createGoal = Goal.create({
			user_id: userData.id,
			goals: goals.map(goal => goal.trim()),
			week_start: weekStart,
			week_end: weekEnd,
			status: GOAL_STATUS.PENDING,
		}, {transaction: t});

		await Promise.all([
			addUserAreaOfInterest,
			createGoal,
		]);
		await t.commit();
		return userData;
	} catch (err) {
		await t.rollback();
		throw err;
	}
}

module.exports = {populateUserDataService};
