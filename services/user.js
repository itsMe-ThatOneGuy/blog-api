const models = require('../models/index');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const errors = require('../middleware/errors/index');

exports.registerUser = asyncHandler(async (body) => {
	return await bcrypt.hash(body.password, 13, async (err, hashedPassword) => {
		if (err) throw new errors.PermissionError();

		const newUser = new models.User({
			username: body.username,
			password: hashedPassword,
		});
		//await newUser.save();
		//
		return newUser;
	});
});
