const models = require('../models/index');
const asyncHandler = require('express-async-handler');

exports.createComment = asyncHandler(async (id, sub, body) => {
	const post = await models.PostModel.getSinglePost(id);
	return await models.CommentModel.createComment(sub, body, post);
});

exports.getSingleComment = asyncHandler(async (id) => {
	return await models.CommentModel.getSingleComment(id);
});

exports.updateComment = asyncHandler(async (id, sub, body) => {
	return await models.CommentModel.updateComment(id, sub, body);
});

exports.deleteComment = asyncHandler(async (commentId, postId, sub, admin) => {
	const comment = await models.CommentModel.deleteComment(
		commentId,
		sub,
		admin,
	);
	const post = await models.PostModel.updatePostComments(postId, commentId);

	return { comment, post };
});
