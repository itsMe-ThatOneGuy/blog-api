const models = require('../models/index');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const errors = require('../middleware/errors/index');
const initPassport = require('../middleware/passport.js');
const passport = require('passport');

initPassport(passport);

exports.userAuth = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			throw new errors.AuthError();
		}
		return next();
	})(req, res, next);
};

exports.tokenAuth = (req, res, next) => {
	passport.authenticate('refresh', function (err, user) {
		if (err) {
			return next(err);
		}
		return next();
	})(req, res, next);
};

exports.loginUser = asyncHandler(async (username, password) => {
	const user = await models.UserModel.User.findOne({
		username: username,
	}).exec();

	const matched = await bcrypt.compare(password, user.password);

	const payload = {
		sub: user._id,
		username: user.username,
		isAdmin: user.isAdmin,
	};

	if (user && matched) {
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
	const refreshToken = cookie.jwt;
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
