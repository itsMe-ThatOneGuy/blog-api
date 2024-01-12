const asyncHandler = require('express-async-handler');
const services = require('../services/index');

exports.register_user = asyncHandler(async (req, res, next) => {
	const { username, password } = req.body;

	try {
		const user = await services.userServices.registerUser(username, password);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'User created',
			user: user,
		});
	} catch (err) {
		return next(err);
	}
});

exports.get_user = asyncHandler(async (req, res, next) => {
	const { userId } = req.params;

	try {
		const user = await services.userServices.getUser(userId);

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
