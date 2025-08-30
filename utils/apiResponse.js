const {ResponseStatusEnum} = require('../constants/enums/responseStatus');

function apiResponse({res, status, statusCode, message, data = null}) {
	return res.status(statusCode).json({
		status,
		message,
		data,
	});
}

module.exports = {apiResponse, ResponseStatusEnum};
