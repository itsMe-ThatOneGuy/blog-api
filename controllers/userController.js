const models = require('../models/index');
const asyncHandler = require('express-async-handler');

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

exports.get_user = asyncHandler(async (req, res) => {
	await models.User.findById(req.params.userId);
	return res.status(200).json({
		statusCode: 200,
		message: 'SELECTED USER',
		user: { id: user._id, username: username },
	});
});
