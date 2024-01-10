const models = require('../models/index');
const asyncHandler = require('express-async-handler');

exports.allPosts = asyncHandler(async () => {
	return await models.PostModel.allPosts();
});

exports.createPost = asyncHandler(async (user, body) => {
	return await models.PostModel.createPosts(user, body);
});

exports.getSinglePost = asyncHandler(async (params) => {
	return await models.PostModel.getSinglePost(params);
});

exports.updatePost = asyncHandler(async (params, user, body) => {
	return await models.PostModel.updatePost(params, user, body);
});

exports.deletePost = asyncHandler(async (params, user) => {
	return await models.PostModel.deletePost(params, user);
});

exports.changePublished = asyncHandler(async (params, user, body) => {
	return await models.PostModel.changePublished(params, user, body);
});
