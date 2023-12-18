const models = require('../models/index');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const passport = require('passport');

exports.test_auth = [
	passport.authenticate('jwt', { session: false }),
	(req, res) => {
		return res.json('AUTH WORKED');
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
			token = jwt.sign({ username: user.username }, 'SECRET_KEY', {
				expiresIn: 120,
			});
			res.json({ token: token, username: user.username });
		} else {
			res.json({ message: 'Username or Password incorrect' });
		}
	} catch (err) {
		next(err);
	}
});
