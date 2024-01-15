const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcryptjs');
const errors = require('../middleware/errors/index');

const UserSchema = new Schema({
	username: { type: String, required: true, unique: true },
	password: { type: String, required: true },
	isAdmin: { type: Boolean, default: false },
});

const User = mongoose.model('User', UserSchema);

const registerUser = asyncHandler(async (username, password) => {
	const salt = await bcrypt.genSalt(13);
	const hashedPassword = await bcrypt.hash(password, salt);

	const newUser = new User({
		username: username,
		password: hashedPassword,
	});

	return await newUser.save();
});

const getUserById = asyncHandler(async (id) => {
	const user = await User.findById(id);
	if (user === null) throw new errors.ResourceError('USER NOT FOUND');

	return user;
});

const getUserByName = asyncHandler(async (username) => {
	const user = await User.findOne({ username: username });
	if (user === null) throw new errors.ResourceError('USER NOT FOUND');

	return user;
});

module.exports = {
	User,
	registerUser,
	getUserById,
	getUserByName,
};
