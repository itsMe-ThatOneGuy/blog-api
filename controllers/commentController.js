const services = require('../services/index');
const asyncHandler = require('express-async-handler');

exports.get_post_comments = asyncHandler(async (req, res, next) => {
	try {
		const post = await services.postServices.getSinglePost(req.params);

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
		const { comment, updatedPost } =
			await services.commentServices.createComment(
				req.params,
				req.user,
				req.body,
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
	try {
		const comment = await services.commentServices.getSingleComment(req.params);

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
	try {
		const comment = await services.commentServices.updateComment(
			req.params,
			req.user,
			req.body,
		);

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
	try {
		const { comment, post } = await services.commentServices.deleteComment(
			req.params,
			req.user,
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
