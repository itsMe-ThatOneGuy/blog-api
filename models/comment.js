const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const errors = require('../middleware/errors/index');

const CommentSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	body: { type: String, required: true },
	commentDate: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', CommentSchema);

const createComment = asyncHandler(async (user, body, post) => {
	const comment = new Comment({
		user: user.sub,
		body: body.body,
	});
	await comment.save();

	post.comments.push(comment);
	const updatedPost = await post.save();

	return { comment, updatedPost };
});

const getSingleComment = asyncHandler(async (params) => {
	const comment = await Comment.findById(params.commentId).populate(
		'user',
		'username',
	);
	if (comment === null) throw new errors.ResourceError('COMMENT NOT FOUND');

	return comment;
});

const updateComment = asyncHandler(async (params, user, body) => {
	const comment = await getSingleComment(params);

	if (comment.user.id !== user.sub)
		throw new errors.PermissionError('NOT AUTHORIZED TO UPDATE COMMENT');

	return await Comment.findByIdAndUpdate(
		params.commentId,
		{ $set: { body: body.body } },
		{ new: true },
	).populate('user', 'username');
});

const deleteComment = asyncHandler(async (params, user) => {
	const comment = await getSingleComment(params);

	if (comment.user.id !== user.sub || !user.isAdmin)
		throw new errors.PermissionError('NOT AUTHORIZED TO DELETE COMMENT');

	await Comment.findByIdAndDelete(params.commentId);

	return comment;
});

const deleteAllPostComments = asyncHandler(async (post) => {
	if (post.comments.length !== 0) {
		post.comments.forEach(async (comment) => {
			await Comment.findByIdAndDelete(comment._id);
		});
	}
});

module.exports = {
	Comment,
	createComment,
	getSingleComment,
	updateComment,
	deleteComment,
	deleteAllPostComments,
};
