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
	bcrypt.hash(password, 13, async (err, hashedPassword) => {
		if (err) throw new errors.PermissionError();

		const newUser = new User({
			username: username,
			password: hashedPassword,
		});

		await newUser.save();
	});
});

const getUser = asyncHandler(async (id) => {
	const user = await User.findById(id);
	if (user === null) throw new errors.ResourceError('USER NOT FOUND');

	return user;
});

module.exports = {
	User,
	registerUser,
	getUser,
};
