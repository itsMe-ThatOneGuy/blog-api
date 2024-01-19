const asyncHandler = require('express-async-handler');
const services = require('../services/index');

exports.test_auth = (req, res, next) => {
	try {
		return res.status(200).json({
			success: true,
			status: 200,
			message: 'AUTH WORKED',
			user: req.user,
		});
	} catch (err) {
		return next(err);
	}
};

exports.refresh = asyncHandler(async (req, res, next) => {
	const { jwt } = req.cookies;

	try {
		const accessToken = await services.authServices.refresh(jwt);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'ACCESS TOKEN REFRESHED',
			token: accessToken,
		});
	} catch (err) {
		return next(err);
	}
});

exports.login_user = asyncHandler(async (req, res, next) => {
	const { username, password } = req.body;

	try {
		const { accessToken, refreshToken } = await services.authServices.loginUser(
			username,
			password,
		);

		return res
			.cookie('jwt', refreshToken, { httpOnly: true, secure: false })
			.status(200)
			.json({
				success: true,
				status: 200,
				token: accessToken,
			});
	} catch (err) {
		next(err);
	}
});
