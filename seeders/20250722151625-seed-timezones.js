'use strict';

const moment = require('moment-timezone');

module.exports = {
	async up(queryInterface) {
		const timezones = moment.tz.names().map(name => {
			const abbreviation = moment.tz(name).format('z');
			return {
				name,
				abbreviation,
			};
		});

		await queryInterface.bulkInsert('Timezones', timezones);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete('Timezones', null);
	},
};
