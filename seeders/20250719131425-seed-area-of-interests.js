'use strict';

module.exports = {
	async up(queryInterface) {
		await queryInterface.bulkInsert('Area_of_Interests', [
			{name: 'Technology'},
			{name: 'Health & Wellness'},
			{name: 'Fitness'},
			{name: 'Personal Finance'},
			{name: 'Entrepreneurship'},
			{name: 'Career Development'},
			{name: 'Education'},
			{name: 'Music'},
			{name: 'Travel'},
			{name: 'Gaming'},
			{name: 'Reading'},
			{name: 'Cooking'},
			{name: 'Mental Health'},
			{name: 'Productivity'},
			{name: 'Art & Design'},
			{name: 'Volunteering'},
			{name: 'Sustainability'},
			{name: 'Photography'},
			{name: 'Public Speaking'},
			{name: 'Meditation & Mindfulness'},
		]);
	},

	async down(queryInterface) {
		await queryInterface.bulkDelete('Area_of_Interests', {
			name: [
				'Technology',
				'Health & Wellness',
				'Fitness',
				'Personal Finance',
				'Entrepreneurship',
				'Career Development',
				'Education',
				'Music',
				'Travel',
				'Gaming',
				'Reading',
				'Cooking',
				'Mental Health',
				'Productivity',
				'Art & Design',
				'Volunteering',
				'Sustainability',
				'Photography',
				'Public Speaking',
				'Meditation & Mindfulness',
			],
		});
	},
};
