const models = require('../models/index');
const asyncHandler = require('express-async-handler');
const errors = require('../middleware/errors/index');

exports.register_user = asyncHandler(async (req, res, next) => {
	try {
		bcrypt.hash(req.body.password, 13, async (err, hashedPassword) => {
			if (err) return next(err);

			const newUser = new models.User({
				username: req.body.username,
				password: hashedPassword,
			});
			await newUser.save();

			return res
				.status(200)
				.json({ statusCode: 200, message: 'User created', user: newUser });
		});
	} catch (err) {
		return next(err);
	}
});

exports.get_user = asyncHandler(async (req, res) => {
	try {
		const user = await models.User.findById(req.params.userId);
		if (user === null) return next(new errors.ResourceError('USER NOT FOUND'));

		return res.status(200).json({
			statusCode: 200,
			message: 'SELECTED USER',
			user: { Id: user._id, username: user.username },
		});
	} catch (err) {
		return next(err);
	}
});
