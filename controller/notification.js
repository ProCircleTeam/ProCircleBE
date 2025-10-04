const {Notification} = require('../models');
const {apiResponse, ResponseStatusEnum} = require('../utils/apiResponse');

const getUserNotifications = async (req, res) => {
	try {
		const userId = req.user.id;

		const data = await Notification.findAll({
			where: {userId},
			order: [['createdAt', 'DESC']],
		});

		return apiResponse({
			res,
			status: ResponseStatusEnum.SUCCESS,
			data,
			statusCode: 200,
			message: 'Fetched notifications successfully',
		});
	} catch (e) {
		console.error('Get user notifications error:', e);

		return apiResponse({
			res,
			status: ResponseStatusEnum.FAIL,
			statusCode: 500,
			message: 'Server error',
		});
	}
};

module.exports = {getUserNotifications};
