const asyncHandler = require('express-async-handler');
const errors = require('../middleware/errors/index');
const { PostModel, CommentModel } = require('../models/index');

const allPosts = asyncHandler(async () => {
	return await PostModel.find({})
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

const createPost = asyncHandler(async (sub, title, body) => {
	const post = new PostModel({
		user: sub,
		title: title,
		body: body,
	});
	await post.save();

	return post.populate('user', 'username');
});

const getSinglePost = asyncHandler(async (id) => {
	const post = await PostModel.findById(id)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});

	if (post === null) throw new errors.ResourceError('POST NOT FOUND', 404);

	return post;
});

const updatePost = asyncHandler(async (id, title, body) => {
	await getSinglePost(id);

	return await PostModel.findByIdAndUpdate(
		id,
		{
			$set: { title: title, body: body },
		},
		{ new: true },
	)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

const deletePost = asyncHandler(async (id) => {
	const post = await getSinglePost(id);

	post.comments.forEach(async (comment) => {
		await CommentModel.findOneAndDelete(comment._id);
	});

	return await PostModel.findByIdAndDelete(id)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

const changePublished = async (id, status) => {
	await getSinglePost(id);

	return await PostModel.findByIdAndUpdate(
		id,
		{ $set: { isPublished: status } },
		{ new: true },
	)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
};

const updatePostComments = asyncHandler(async (postId, commentId) => {
	return await PostModel.findOneAndUpdate(
		{ _id: postId },
		{
			$pull: {
				comments: commentId,
			},
		},
	)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

module.exports = {
	allPosts,
	createPost,
	getSinglePost,
	updatePost,
	deletePost,
	changePublished,
	updatePostComments,
};
