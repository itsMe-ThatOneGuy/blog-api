const models = require('../models/index');
const asyncHandler = require('express-async-handler');

exports.registerUser = asyncHandler(async (body) => {
	return await models.UserModel.registerUser(body);
});

exports.getUser = asyncHandler(async (params) => {
	return await models.UserModel.getUser(params);
});
