const models = require('../models/index');
const mongoose = require('mongoose');
const asyncHandler = require('express-async-handler');
const passport = require('passport');

exports.get_post_comments = asyncHandler(async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
		return res
			.status(400)
			.json({ statusCode: 400, message: 'POST ID IS NOT VALID' });
	}

	const post = await models.Post.findById(req.params.postId).populate({
		path: 'comments',
		populate: { path: 'user', select: 'username' },
	});

	if (post === null) {
		return res
			.status(404)
			.json({ statusCode: 404, message: 'COULD NOT FIND POST' });
	}

	return res.status(200).json({
		statusCode: 200,
		message: 'SELECTED POSTS COMMENTS',
		comments: post.comments,
	});
});

exports.post_create_comment = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
			return res
				.status(400)
				.json({ statusCode: 400, message: 'POST ID IS NOT VALID' });
		}

		const comment = new models.Comment({
			user: req.user.sub,
			body: req.body.body,
		});
		await comment.save();

		const post = await models.Post.findById(req.params.postId);
		post.comments.push(comment);
		const updatedPost = await post.save();

		return res
			.status(200)
			.json({ statusCode: 200, comment: comment, updatedPost: updatedPost });
	}),
];

exports.get_single_comment = asyncHandler(async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
		return res
			.status(400)
			.json({ statusCode: 400, message: 'COMMENT ID IS NOT VALID' });
	}

	const comment = await models.Comment.findById(req.params.commentId);

	if (comment === null) {
		return res
			.status(404)
			.json({ statusCode: 404, message: 'COULD NOT FIND COMMENT' });
	}

	return res
		.status(200)
		.json({ statusCode: 200, message: 'GET SINGLE COMMENT', comment: comment });
});

exports.put_update_comment = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
			return res
				.status(400)
				.json({ statusCode: 400, message: 'COMMENT ID IS NOT VALID' });
		}

		const comment = await models.Comment.findById(req.params.commentId);

		if (comment === null) {
			return res
				.status(404)
				.json({ statusCode: 404, message: 'COULD NOT FIND COMMENT' });
		}

		if (comment.user.id === req.user.sub) {
			const updatedComment = {
				user: comment.user,
				body: req.body.body,
			};

			const update = await models.Comment.findByIdAndUpdate(
				req.params.commentId,
				updatedComment,
				{},
			);

			return res
				.status(200)
				.json({ statusCode: 200, message: 'UPDATE COMMENT', comment: update });
		} else {
			return res
				.status(403)
				.json({ statusCode: 403, message: 'NOT AUTHORIZED TO UPDATE' });
		}
	}),
];

exports.delete_comment = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
			return res
				.status(400)
				.json({ statusCode: 400, message: 'POST ID IS NOT VALID' });
		}
		if (!mongoose.Types.ObjectId.isValid(req.params.commentId)) {
			return res
				.status(400)
				.json({ statusCode: 400, message: 'COMMENT ID IS NOT VALID' });
		}

		const comment = await models.Comment.findById(
			req.params.commentId,
		).populate('user', 'id');

		if (comment === null) {
			return res
				.status(404)
				.json({ statusCode: 404, message: 'COULD NOT FIND COMMENT' });
		}

		if (comment.user.id === req.user.sub || req.user.isAdmin) {
			await models.Comment.findByIdAndDelete(req.params.commentId);
			await models.Post.findOneAndUpdate(
				{ _id: req.params.postId },
				{
					$pull: {
						comments: req.params.commentId,
					},
				},
			);
			return res
				.status(200)
				.json({ statusCode: 200, message: 'DELETE COMMENT', comment: comment });
		} else {
			return res
				.status(403)
				.json({ statusCode: 403, message: 'NOT AUTHORIZED TO DELETE COMMENT' });
		}
	}),
];
