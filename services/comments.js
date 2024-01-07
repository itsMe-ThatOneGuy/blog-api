const models = require('../models/index');
const errors = require('../middleware/errors/index');
const postServices = require('./posts');
const asyncHandler = require('express-async-handler');

exports.createComment = asyncHandler(async (params, user, body) => {
	const post = await postServices.getSinglePost(params);

	const comment = new models.Comment({
		user: user.sub,
		body: body.body,
	});
	await comment.save();

	post.comments.push(comment);
	const updatedPost = await post.save();

	return { comment, updatedPost };
});

exports.getSingleComment = asyncHandler(async (params) => {
	const comment = await models.Comment.findById(params.commentId).populate(
		'user',
		'username',
	);
	if (comment === null) throw new errors.ResourceError('COMMENT NOT FOUND');

	return comment;
});

exports.updateComment = asyncHandler(async (params, user, body) => {
	const comment = await this.getSingleComment(params);

	if (comment.user.id !== user.sub)
		throw new errors.PermissionError('NOT AUTHORIZED TO UPDATE COMMENT');

	return await models.Comment.findByIdAndUpdate(
		params.commentId,
		{ $set: { body: body.body } },
		{ new: true },
	).populate('user', 'username');
});

exports.deleteComment = asyncHandler(async (params, user) => {
	const comment = await this.getSingleComment(params);

	if (comment.user.id !== user.sub || !user.isAdmin)
		throw new errors.PermissionError('NOT AUTHORIZED TO DELETE COMMENT');

	await models.Comment.findByIdAndDelete(params.commentId);

	await models.Post.findOneAndUpdate(
		{ _id: params.postId },
		{
			$pull: {
				comments: params.commentId,
			},
		},
	);

	return comment;
});
