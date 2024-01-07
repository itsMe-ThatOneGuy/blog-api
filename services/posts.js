const models = require('../models/index');
const errors = require('../middleware/errors/index');
const asyncHandler = require('express-async-handler');

exports.allPosts = asyncHandler(async () => {
	return await models.Post.find({})
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

exports.createPost = asyncHandler(async (user, body) => {
	if (!user.isAdmin)
		throw new errors.PermissionError('NOT AUTHORIZED TO MAKE POSTS');

	const post = new models.Post({
		user: user.sub,
		title: body.title,
		body: body.body,
	});
	await post.save();

	return post.populate('user', 'username');
});

exports.getSinglePost = asyncHandler(async (params) => {
	const post = await models.Post.findById(params.postId)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});

	if (post === null) throw new errors.ResourceError('COULD NOT FIND POST', 404);

	return post;
});

exports.updatePost = asyncHandler(async (params, user, body) => {
	if (!user.isAdmin)
		throw new errors.PermissionError('NOT AUTHORIZED TO UPDATE POSTS');

	await this.getSinglePost(params);

	return await models.Post.findByIdAndUpdate(
		params.postId,
		{ $set: { title: body.title, body: body.body } },
		{ new: true },
	)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

exports.deletePost = asyncHandler(async (params, user) => {
	if (!user.isAdmin)
		throw new errors.PermissionError('NOT AUTHORIZED TO DELETE POSTS');

	const post = await this.getSinglePost(params);

	if (post.comments.length !== 0) {
		post.comments.forEach(async (comment) => {
			await models.Comment.findByIdAndDelete(comment._id);
		});
	}

	await models.Post.findByIdAndDelete(params.postId);

	return post;
});

exports.changePublished = asyncHandler(async (params, user, body) => {
	if (!user.isAdmin)
		throw new errors.PermissionError(
			'NOT AUTHORIZED TO CHANGE POST PUBLISH STATUS',
		);

	await this.getSinglePost(params);

	return await models.Post.findByIdAndUpdate(
		params.postId,
		{ $set: { isPublished: body.isPublished } },
		{ new: true },
	)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});
