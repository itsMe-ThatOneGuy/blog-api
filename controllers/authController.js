const models = require('../models/index');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errors = require('../middleware/errors/index');

exports.test_auth = (req, res, next) => {
	try {
		return res
			.status(200)
			.json({ statusCode: 200, message: 'AUTH WORKED', user: req.user });
	} catch (err) {
		return next(err);
	}
};

};

exports.refresh = asyncHandler(async (req, res, next) => {
	try {
		const refreshToken = req.cookies.jwt;
		if (!refreshToken)
			return next(new errors.AuthError('ACCESS DENIED, NO REFRESH TOKEN', 401));

		const decoded = jwt.verify(
			refreshToken,
			process.env.JWT_REFRESH_KEY,
			(err, decoded) => {
				if (err)
					return next(new errors.AuthError('INVALID REFRESH TOKEN', 400));

				return decoded;
			},
		);

		if (decoded) {
			const payload = {
				sub: decoded.sub,
				username: decoded.username,
				isAdmin: decoded.isAdmin,
			};

			const accessToken = jwt.sign(payload, process.env.JWT_TOKEN_KEY, {
				expiresIn: 120,
			});

			return res.status(200).json({
				statusCode: 200,
				message: 'ACCESS TOKEN REFRESHED',
				token: accessToken,
			});
		}
	} catch (err) {
		return next(err);
	}
});

exports.login_user = asyncHandler(async (req, res, next) => {
	try {
		const user = await models.User.findOne({
			username: req.body.username,
		}).exec();
		const password = await bcrypt.compare(req.body.password, user.password);

		const payload = {
			sub: user._id,
			username: user.username,
			isAdmin: user.isAdmin,
		};

		if (user && password) {
			const accessToken = jwt.sign(payload, process.env.JWT_TOKEN_KEY, {
				expiresIn: 120,
			});

			const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
				expiresIn: '1d',
			});

			res
				.cookie('jwt', refreshToken, { httpOnly: true, secure: false })
				.status(200)
				.json({ statusCode: 200, token: accessToken, refresh: refreshToken });
		} else {
			return next(new errors.AuthError('INVALID USERNAME OR PASSWORD', 401));
		}
	} catch (err) {
		next(err);
	}
});
