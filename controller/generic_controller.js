const {User} = require('../models');
const {sendMail} = require('../utils/mailer');
const {apiResponse, ResponseStatusEnum} = require('../utils/apiResponse');
const {EnvEnum} = require('../constants/enums/environments');
const {clearDBDataService} = require('../services/generic/clearDB');

const generic = async (req, res) => {
	if (!req.body || !req.body.email) {
		return apiResponse({
			res,
			status: ResponseStatusEnum.FAIL,
			statusCode: 400,
			message: 'Email is required',
			data: {},
		});
	}

	const {email} = req.body;

	const user = await User.findOne({where: {email}});
	if (!user) {
		return apiResponse({
			res,
			status: ResponseStatusEnum.FAIL,
			statusCode: 404,
			message: 'No user with such code',
			data: {},
		});
	}

	const resetCode = Math.floor(100000 + (Math.random() * 900000)).toString();
	const expiration = new Date(Date.now() + (10 * 60 * 1000));

	await user.update({resetCode, resetCodeExpiration: expiration});

	await sendMail({
		to: email,
		subject: 'ProCircle Password Request OTP',
		text: `Your OTP code is ${resetCode}`,
		html: `<p>Your OTP code is <strong>${resetCode}</strong></p>`,
	});

	return apiResponse({
		res,
		status: ResponseStatusEnum.SUCCESS,
		statusCode: 200,
		message: 'Code generated successfully',
		data: {},
	});
};

const clearDBData = async (req, res) => {
	if (process.env.NODE_ENV === EnvEnum.PRODUCTION) {
		return apiResponse({
			res,
			status: ResponseStatusEnum.SUCCESS,
			statusCode: 200,
			data: null,
			message: 'You can not perform this operation on production',
		});
	}

	try {
		await clearDBDataService();

		return apiResponse({
			res,
			status: ResponseStatusEnum.SUCCESS,
			statusCode: 200,
			data: null,
			message: 'DB successfully cleared',
		});
	} catch (error) {
		console.error('ERROR: >>>>>>> ', error);
		return apiResponse({
			res,
			status: ResponseStatusEnum.FAIL,
			statusCode: 500,
			message: error,
		});
	}
};

module.exports = {
	generic,
	clearDBData,
};
