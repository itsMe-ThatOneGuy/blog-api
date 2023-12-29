const models = require('../models/index');
const asyncHandler = require('express-async-handler');
const errors = require('../middleware/errors/index');

exports.get_post_comments = asyncHandler(async (req, res, next) => {
	try {
		const post = await models.Post.findById(req.params.postId).populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
		if (post === null) return next(new errors.ResourceError('POST NOT FOUND'));

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'SELECTED POSTS COMMENTS',
			comments: post.comments,
		});
	} catch (err) {
		return next(err);
	}
});

exports.create_comment = asyncHandler(async (req, res, next) => {
	try {
		const comment = new models.Comment({
			user: req.user.sub,
			body: req.body.body,
		});
		await comment.save();

		const post = await models.Post.findById(req.params.postId);
		if (post === null) return next(new errors.ResourceError('POST NOT FOUND'));
		post.comments.push(comment);

		const updatedPost = await post.save();

		return res.status(200).json({
			success: true,
			status: 200,
			comment: comment,
			updatedPost: updatedPost,
		});
	} catch (err) {
		return next(err);
	}
});

exports.get_single_comment = asyncHandler(async (req, res, next) => {
	const comment = await models.Comment.findById(req.params.commentId);
	if (comment === null)
		return next(new errors.ResourceError('COMMENT NOT FOUND'));

	return res.status(200).json({
		success: true,
		status: 200,
		message: 'GET SINGLE COMMENT',
		comment: comment,
	});
});

exports.update_comment = asyncHandler(async (req, res, next) => {
	try {
		const comment = await models.Comment.findById(req.params.commentId);
		if (comment === null)
			return next(new errors.ResourceError('COMMENT NOT fOUND'));
		if (comment.user.id !== req.user.sub)
			return next(
				new errors.PermissionError('NOT AUTHORIZED TO UPDATE COMMENT'),
			);

		const update = await models.Comment.findByIdAndUpdate(
			req.params.commentId,
			{ $set: { body: req.body.body } },
			{ new: true },
		);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'UPDATE COMMENT',
			comment: update,
		});
	} catch (err) {
		next(err);
	}
});

exports.delete_comment = asyncHandler(async (req, res) => {
	try {
		const comment = await models.Comment.findById(
			req.params.commentId,
		).populate('user', 'id');
		if (comment === null)
			return next(new errors.ResourceError('COMMENT NOT FOUND'));

		if (comment.user.id === req.user.sub || req.user.isAdmin)
			return next(
				new errors.PermissionError('NOT AUTHORIZED TO DELETE COMMENT'),
			);

		await models.Comment.findByIdAndDelete(req.params.commentId);

		await models.Post.findOneAndUpdate(
			{ _id: req.params.postId },
			{
				$pull: {
					comments: req.params.commentId,
				},
			},
		);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'DELETE COMMENT',
			comment: comment,
		});
	} catch (err) {
		return next(err);
	}
});
