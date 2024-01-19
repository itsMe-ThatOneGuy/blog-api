const asyncHandler = require('express-async-handler');
const { postServices, commentServices } = require('../services/index');

exports.get_post_comments = asyncHandler(async (req, res, next) => {
	const { postId } = req.params;

	try {
		const post = await postServices.getSinglePost(postId);

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
	const { postId } = req.params;
	const { sub } = req.user;
	const { body } = req.body;

	try {
		const { comment, updatedPost } = await commentServices.createComment(
			postId,
			sub,
			body,
		);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'CREATED COMMENT',
			comment: comment,
			post: updatedPost,
		});
	} catch (err) {
		return next(err);
	}
});

exports.get_single_comment = asyncHandler(async (req, res, next) => {
	const { commentId } = req.params;

	try {
		const comment = await commentServices.getSingleComment(commentId);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'GET SINGLE COMMENT',
			comment: comment,
		});
	} catch (err) {
		next(err);
	}
});

exports.update_comment = asyncHandler(async (req, res, next) => {
	const { commentId } = req.params;
	const { sub } = req.user;
	const { body } = req.body;

	try {
		const comment = await commentServices.updateComment(commentId, sub, body);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'UPDATE COMMENT',
			comment: comment,
		});
	} catch (err) {
		next(err);
	}
});

exports.delete_comment = asyncHandler(async (req, res, next) => {
	const { commentId } = req.params;
	const { sub, isAdmin } = req.user;

	try {
		const { comment, post } = await commentServices.deleteComment(
			commentId,
			sub,
			isAdmin,
		);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'DELETE COMMENT',
			comment: comment,
			post: post,
		});
	} catch (err) {
		return next(err);
	}
});
