const models = require('../models/index');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

exports.test_auth = [
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		return res.json({ message: 'AUTH WORKED', user: req.user });
	},
];

exports.refresh = [
	passport.authenticate('refresh', { session: false }),
	asyncHandler(async (req, res) => {
		const refreshToken = req.cookies.jwt;
		if (!refreshToken) {
			return res
				.status(401)
				.json({ message: 'Access Denied. No refresh token provided' });
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
			res.json({
				message: 'ACCESS TOKEN REFRESHED',
				token: accessToken,
			});
		} catch {
			return res.status(400).json('Invalid refresh token');
		}
	}),
];

exports.register_user = asyncHandler(async (req, res) => {
	bcrypt.hash(req.body.password, 13, async (err, hashedPassword) => {
		const newUser = new models.User({
			username: req.body.username,
			password: hashedPassword,
		});
		await newUser.save();
		res.json({ message: 'User created', user: newUser });
	});
});

exports.login_user = asyncHandler(async (req, res) => {
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
				.json({ token: accessToken, refresh: refreshToken });
		} else {
			res.json({ message: 'Username or Password incorrect' });
		}
	} catch (err) {
		console.error(err);
	}
});
