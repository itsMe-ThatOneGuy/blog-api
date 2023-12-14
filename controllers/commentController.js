const models = require('../models/index');
const asyncHandler = require('express-async-handler');

exports.get_post_comments = asyncHandler(async (req, res) => {
	const post = await models.Post.findById(req.params.postId).populate(
		'comments',
	);
	return res.json(post.comments);
});

exports.post_create_comment = asyncHandler(async (req, res) => {
	const comment = new models.Comment({
		user: req.context.user,
		body: req.body.body,
	});
	await comment.save();
	const post = await models.Post.findById(req.params.postId);
	post.comments.push(comment);
	const updatedPost = await post.save();
	return res.json({ comment: comment, updatedPost: updatedPost });
});

exports.get_single_comment = asyncHandler(async (req, res) => {
	const comment = await models.Comment.findById(req.params.commentId);
	return res.json(comment);
});

exports.put_update_comment = asyncHandler(async (req, res) => {
	const comment = await models.Comment.findById(req.params.commentId);

	const updatedComment = {
		user: comment.user,
		body: req.body.body,
	};

	const update = await models.Comment.findByIdAndUpdate(
		req.params.commentId,
		updatedComment,
		{},
	);
	return res.json(update);
});

exports.delete_comment = asyncHandler(async (req, res) => {
	const comment = await models.Comment.findByIdAndDelete(req.params.commentId);
	await models.Post.findOneAndUpdate(
		{ _id: req.params.postId },
		{
			$pull: {
				comments: req.params.commentId,
			},
		},
	);
	return res.json(comment);
});
