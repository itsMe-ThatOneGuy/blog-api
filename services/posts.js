const models = require('../models/index');
const asyncHandler = require('express-async-handler');

exports.allPosts = asyncHandler(async () => {
	return await models.PostModel.allPosts();
});

exports.createPost = asyncHandler(async (sub, title, body) => {
	return await models.PostModel.createPosts(sub, title, body);
});

exports.getSinglePost = asyncHandler(async (id) => {
	return await models.PostModel.getSinglePost(id);
});

exports.updatePost = asyncHandler(async (admin, id, title, body) => {
	return await models.PostModel.updatePost(admin, id, title, body);
});

exports.deletePost = asyncHandler(async (admin, id) => {
	const post = await models.PostModel.getSinglePost(id);
	const deletedPost = await models.PostModel.deletePost(admin, id);
	await models.CommentModel.deleteAllPostComments(post);

	return deletedPost;
});

exports.changePublished = asyncHandler(async (admin, id, status) => {
	return await models.PostModel.changePublished(admin, id, status);
});
