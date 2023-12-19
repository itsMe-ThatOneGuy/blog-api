const models = require('../models/index');
const asyncHandler = require('express-async-handler');
const passport = require('passport');

exports.get_post_comments = asyncHandler(async (req, res) => {
	const post = await models.Post.findById(req.params.postId).populate({
		path: 'comments',
		populate: { path: 'user', select: 'username' },
	});
	return res.json({
		message: 'SELECTED POSTS COMMENTS',
		comments: post.comments,
	});
});

exports.post_create_comment = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		const comment = new models.Comment({
			user: req.user.sub,
			body: req.body.body,
		});
		await comment.save();
		const post = await models.Post.findById(req.params.postId);
		post.comments.push(comment);
		const updatedPost = await post.save();
		return res.json({ comment: comment, updatedPost: updatedPost });
	}),
];

exports.get_single_comment = asyncHandler(async (req, res) => {
	const comment = await models.Comment.findById(req.params.commentId);
	return res.json({ message: 'GET SINGLE COMMENT', comment: comment });
});

exports.put_update_comment = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		const comment = await models.Comment.findById(req.params.commentId);

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

			return res.json({ message: 'UPDATE COMMENT', comment: update });
		} else {
			return res.statusCode(403).json({ message: 'NOT AUTHORIZED TO UPDATE' });
		}
	}),
];

exports.delete_comment = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		const comment = await models.Comment.findById(
			req.params.commentId,
		).populate('user', 'id');

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
			return res.json({ message: 'DELETE COMMENT', comment: comment });
		} else {
			return res.statusCode(403).json('NOT AUTHORIZED TO DELETE COMMENT');
		}
	}),
];
