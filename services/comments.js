const models = require('../models/index');
const errors = require('../middleware/errors/index');
const asyncHandler = require('express-async-handler');

exports.createComment = asyncHandler(async (params, user, body) => {
	const post = await models.PostModel.getSinglePost(params);
	return await models.CommentModel.createComment(user, body, post);
});

exports.getSingleComment = asyncHandler(async (params) => {
	return await models.CommentModel.getSingleComment(params);
});

exports.updateComment = asyncHandler(async (params, user, body) => {
	return await models.CommentModel.updateComment(params, user, body);
});

exports.deleteComment = asyncHandler(async (params, user) => {
	const comment = await models.CommentModel.deleteComment(params, user);
	const post = await models.PostModel.updatePostComments(params);

	return { comment, post };
});
