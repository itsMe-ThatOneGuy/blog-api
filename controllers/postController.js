const models = require('../models/index');
const asyncHandler = require('express-async-handler');

exports.get_all_posts = asyncHandler(async (req, res) => {
	const allPosts = await models.Post.find({}).populate('comments');
	return res.json(allPosts);
});

exports.post_create_post = asyncHandler(async (req, res) => {
	const post = new models.Post({
		user: req.context.user,
		title: req.body.title,
		body: req.body.body,
	});
	await post.save();
	return res.json(post);
});

exports.get_single_post = asyncHandler(async (req, res) => {
	const post = await models.Post.findById(req.params.postId).populate(
		'comments',
	);
	return res.json(post);
});

exports.put_update_post = asyncHandler(async (req, res) => {
	const post = new models.Post({
		_id: req.params.postId,
		user: req.context.user,
		title: req.body.title,
		body: req.body.body,
	});
	const updatedPost = await models.Post.findByIdAndUpdate(
		req.params.postId,
		post,
		{},
	);
	return res.json(updatedPost);
});

exports.delete_post = asyncHandler(async (req, res) => {
	const removedPost = await models.Post.findByIdAndDelete(req.params.id);
	return res.json(`Deleted ${removedPost}`);
});
