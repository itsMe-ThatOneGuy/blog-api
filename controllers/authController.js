const models = require('../models/index');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.test_auth = (req, res) => {
	return res
		.status(200)
		.json({ statusCode: 200, message: 'AUTH WORKED', user: req.user });
};

exports.refresh = asyncHandler(async (req, res) => {
	const refreshToken = req.cookies.jwt;
	if (!refreshToken) {
		return res
			.status(401)
			.json({ statusCode: 401, message: 'ACCESS DENIED, NO REFRESH TOKEN' });
	}

	try {
		const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_KEY);
		const payload = {
			sub: decoded.sub,
			username: decoded.username,
			isAdmin: decoded.isAdmin,
		};
		const accessToken = jwt.sign(payload, process.env.JWT_TOKEN_KEY, {
			expiresIn: 120,
		});
		res.status(200).json({
			statusCode: 200,
			message: 'ACCESS TOKEN REFRESHED',
			token: accessToken,
		});
	} catch {
		return res
			.status(400)
			.json({ statusCode: 400, message: 'Invalid refresh token' });
	}
});

exports.register_user = asyncHandler(async (req, res, next) => {
	bcrypt.hash(req.body.password, 13, async (err, hashedPassword) => {
		if (err) return next(err);
		const newUser = new models.User({
			username: req.body.username,
			password: hashedPassword,
		});
		await newUser.save();
		res
			.status(200)
			.json({ statusCode: 200, message: 'User created', user: newUser });
	});
});

exports.login_user = asyncHandler(async (req, res) => {
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
		res
			.status(401)
			.json({ statusCode: 401, message: 'Username or Password incorrect' });
	}
});
