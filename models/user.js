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

const registerUser = asyncHandler(async (body) => {
	bcrypt.hash(body.password, 13, async (err, hashedPassword) => {
		if (err) throw new errors.PermissionError();

		const newUser = new User({
			username: body.username,
			password: hashedPassword,
		});

		await newUser.save();
	});

	return body.username;
});

const getUser = asyncHandler(async (params) => {
	const user = await User.findById(params.userId);
	if (user === null) throw new errors.ResourceError('USER NOT FOUND');

	return user;
});

module.exports = {
	User,
	registerUser,
	getUser,
};
