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
		if (user && password) {
			token = jwt.sign(
				{ sub: user._id, username: user.username, isAdmin: user.isAdmin },
				process.env.JWT_TOKEN_KEY,
				{
					expiresIn: 120,
				},
			);
			res.json({ token: token });
		} else {
			res.json({ message: 'Username or Password incorrect' });
		}
	} catch (err) {
		next(err);
	}
});
