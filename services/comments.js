const asyncHandler = require('express-async-handler');
const errors = require('../middleware/errors/index');
const { CommentModel } = require('../models/index');
const postServices = require('./posts');

const validateUser = asyncHandler(async (comment, sub, admin) => {
	if (admin === undefined) {
		if (comment.user.id !== sub) throw new errors.PermissionError();
	} else {
		if (comment.user.id !== sub && !admin)
			throw new errors.PermissionError('NOT AUTHORIZED TO DELETE COMMENT');
	}
});

const createComment = asyncHandler(async (id, sub, body) => {
	const post = await postServices.getSinglePost(id);
	const comment = new CommentModel({
		user: sub,
		body: body,
	});
	await comment.save();

	post.comments.push(comment);
	await postServices.updatePostComments(post._id, comment._id);

	const updatedPost = await post.save();

	return { comment, updatedPost };
});

const getSingleComment = asyncHandler(async (id) => {
	const comment = await CommentModel.findById(id).populate('user', 'username');
	if (comment === null) throw new errors.ResourceError('COMMENT NOT FOUND');

	return comment;
});

const updateComment = asyncHandler(async (id, sub, body) => {
	const comment = await getSingleComment(id);

	if (comment.user.id !== sub)
		throw new errors.PermissionError('NOT AUTHORIZED TO UPDATE COMMENT');

	return await CommentModel.findByIdAndUpdate(
		id,
		{ $set: { body: body } },
		{ new: true },
	).populate('user', 'username');
});

const deleteComment = asyncHandler(async (id, sub, admin) => {
	const comment = await getSingleComment(id);

	if (comment.user.id !== sub && !admin) {
		throw new errors.PermissionError('NOT AUTHORIZED TO DELETE COMMENT');
	}

	return await CommentModel.findByIdAndDelete(id).populate('user', 'username');
});

module.exports = {
	createComment,
	getSingleComment,
	updateComment,
	deleteComment,
};
