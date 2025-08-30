// Helper function to get current week boundaries
const getWeekBoundaries = (date = new Date()) => {
	const currentDate = new Date(date);
	const dayOfWeek = currentDate.getDay();
	const diff = currentDate.getDate() - dayOfWeek;

	const weekStart = new Date(currentDate.setDate(diff));
	weekStart.setHours(0, 0, 0, 0);

	const weekEnd = new Date(weekStart);
	weekEnd.setDate(weekStart.getDate() + 5);
	weekEnd.setHours(23, 59, 59, 999);

	return {weekStart, weekEnd};
};

module.exports = getWeekBoundaries;
