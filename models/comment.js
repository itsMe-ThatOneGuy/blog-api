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

const createComment = asyncHandler(async (sub, body, post) => {
	const comment = new Comment({
		user: sub,
		body: body,
	});
	await comment.save();

	post.comments.push(comment);
	const updatedPost = await post.save();

	return { comment, updatedPost };
});

const getSingleComment = asyncHandler(async (id) => {
	const comment = await Comment.findById(id).populate('user', 'username');
	if (comment === null) throw new errors.ResourceError('COMMENT NOT FOUND');

	return comment;
});

const updateComment = asyncHandler(async (id, sub, body) => {
	const comment = await getSingleComment(id);

	if (comment.user.id !== sub)
		throw new errors.PermissionError('NOT AUTHORIZED TO UPDATE COMMENT');

	return await Comment.findByIdAndUpdate(
		id,
		{ $set: { body: body } },
		{ new: true },
	).populate('user', 'username');
});

const deleteComment = asyncHandler(async (id, sub, admin) => {
	const comment = await getSingleComment(id);

	if (comment.user.id !== sub || !admin)
		throw new errors.PermissionError('NOT AUTHORIZED TO DELETE COMMENT');

	await Comment.findByIdAndDelete(id);

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
