const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const errors = require('../middleware/errors/index');
const { UserModel } = require('../models/index');

const registerUser = asyncHandler(async (username, password) => {
	const salt = await bcrypt.genSalt(13);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = new UserModel({
		username: username,
		password: hashedPassword,
	});

	return await newUser.save();
});

const getUserById = asyncHandler(async (id) => {
	const user = await UserModel.findById(id);
	if (user === null) throw new errors.ResourceError('USER NOT FOUND');

	return user;
});

const getUserByName = asyncHandler(async (username) => {
	const user = await UserModel.findOne({ username: username });
	if (user === null) throw new errors.ResourceError('USER NOT FOUND');

	return user;
});

module.exports = {
	registerUser,
	getUserById,
	getUserByName,
};
