const asyncHandler = require('express-async-handler');
const services = require('../services/index');

exports.register_user = asyncHandler(async (req, res, next) => {
	try {
		await services.userServices.registerUser(req.body);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'User created',
		});
	} catch (err) {
		return next(err);
	}
});

exports.get_user = asyncHandler(async (req, res, next) => {
	try {
		const user = await services.userServices.getUser(req.params);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'SELECTED USER',
			user: { Id: user._id, username: user.username },
		});
	} catch (err) {
		return next(err);
	}
});
