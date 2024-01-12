const models = require('../models/index');
const asyncHandler = require('express-async-handler');

exports.registerUser = asyncHandler(async (username, password) => {
	return await models.UserModel.registerUser(username, password);
});

exports.getUser = asyncHandler(async (id) => {
	return await models.UserModel.getUser(id);
});
