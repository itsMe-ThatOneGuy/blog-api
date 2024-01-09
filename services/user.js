const models = require('../models/index');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const errors = require('../middleware/errors/index');

exports.registerUser = asyncHandler(async (body) => {
	bcrypt.hash(body.password, 13, async (err, hashedPassword) => {
		if (err) throw new errors.PermissionError();

		const newUser = new models.User({
			username: body.username,
			password: hashedPassword,
		});

		await newUser.save();
	});
});

exports.getUser = asyncHandler(async (params) => {
	const user = await models.User.findById(params.userId);
	if (user === null) throw new errors.ResourceError('USER NOT FOUND');

	return user;
});
