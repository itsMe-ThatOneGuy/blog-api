const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errors = require('../middleware/errors/index');
const UserService = require('./user');

exports.loginUser = asyncHandler(async (username, password) => {
	const user = await UserService.getUserByName(username);

	const _password = await bcrypt.compare(password, user.password);

	const payload = {
		sub: user._id,
		username: user.username,
		isAdmin: user.isAdmin,
	};

	if (user && _password) {
		const accessToken = jwt.sign(payload, process.env.JWT_TOKEN_KEY, {
			expiresIn: 120,
		});

		const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, {
			expiresIn: '1d',
		});

		return { accessToken, refreshToken };
	} else {
		throw new errors.AuthError('INVALID USERNAME OR PASSWORD', 401);
	}
});

exports.refresh = asyncHandler(async (cookie) => {
	const refreshToken = cookie;
	if (!refreshToken)
		throw new errors.AuthError('ACCESS DENIED, NO REFRESH TOKEN', 401);

	const decoded = jwt.verify(
		refreshToken,
		process.env.JWT_REFRESH_KEY,
		(err, decoded) => {
			if (err) throw new errors.AuthError('INVALID REFRESH TOKEN', 400);

			return decoded;
		},
	);

	if (decoded) {
		const payload = {
			sub: decoded.sub,
			username: decoded.username,
			isAdmin: decoded.isAdmin,
		};

		return jwt.sign(payload, process.env.JWT_TOKEN_KEY, {
			expiresIn: 120,
		});
	}
});
