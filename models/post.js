const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const asyncHandler = require('express-async-handler');
const errors = require('../middleware/errors/index');

const PostSchema = new Schema({
	user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
	title: { type: String, required: true },
	body: { type: String, required: true },
	comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
	isPublished: { type: Boolean, default: false },
	postDate: { type: Date, default: Date.now },
});

const Post = mongoose.model('Post', PostSchema);

const allPosts = asyncHandler(async () => {
	return await Post.find({})
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

const createPosts = asyncHandler(async (sub, title, body) => {
	const post = new Post({
		user: sub,
		title: title,
		body: body,
	});
	await post.save();

	return post.populate('user', 'username');
});

const getSinglePost = asyncHandler(async (id) => {
	const post = await Post.findById(id)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});

	if (post === null) throw new errors.ResourceError('COULD NOT FIND POST', 404);

	return post;
});

const updatePost = asyncHandler(async (admin, id, title, body) => {
	if (!admin)
		throw new errors.PermissionError('NOT AUTHORIZED TO UPDATE POSTS');

	await getSinglePost(id);

	return await Post.findByIdAndUpdate(
		id,
		{ $set: { title: title, body: body } },
		{ new: true },
	)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

const deletePost = asyncHandler(async (admin, id) => {
	if (!admin)
		throw new errors.PermissionError('NOT AUTHORIZED TO DELETE POSTS');

	return await Post.findByIdAndDelete(id)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

const changePublished = async (admin, id, status) => {
	if (!admin)
		throw new errors.PermissionError(
			'NOT AUTHORIZED TO CHANGE POST PUBLISH STATUS',
		);

	await getSinglePost(id);

	return await Post.findByIdAndUpdate(
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
	return await Post.findOneAndUpdate(
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
	Post,
	allPosts,
	createPosts,
	getSinglePost,
	updatePost,
	deletePost,
	changePublished,
	updatePostComments,
};
