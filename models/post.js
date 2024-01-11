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

const createPosts = asyncHandler(async (user, body) => {
	if (!user.isAdmin)
		throw new errors.PermissionError('NOT AUTHORIZED TO MAKE POSTS');

	const post = new Post({
		user: user.sub,
		title: body.title,
		body: body.body,
	});
	await post.save();

	return post.populate('user', 'username');
});

const getSinglePost = asyncHandler(async (params) => {
	const post = await Post.findById(params.postId)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});

	if (post === null) throw new errors.ResourceError('COULD NOT FIND POST', 404);

	return post;
});

const updatePost = asyncHandler(async (params, user, body) => {
	if (!user.isAdmin)
		throw new errors.PermissionError('NOT AUTHORIZED TO UPDATE POSTS');

	await getSinglePost(params);

	return await Post.findByIdAndUpdate(
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

const deletePost = asyncHandler(async (params, user, comments) => {
	if (!user.isAdmin)
		throw new errors.PermissionError('NOT AUTHORIZED TO DELETE POSTS');

	return await Post.findByIdAndDelete(params.postId)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

const changePublished = async (params, user, body) => {
	if (!user.isAdmin)
		throw new errors.PermissionError(
			'NOT AUTHORIZED TO CHANGE POST PUBLISH STATUS',
		);

	await getSinglePost(params);

	return await Post.findByIdAndUpdate(
		params.postId,
		{ $set: { isPublished: body.isPublished } },
		{ new: true },
	)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
};

const updatePostComments = asyncHandler(async (params) => {
	return await Post.findOneAndUpdate(
		{ _id: params.postId },
		{
			$pull: {
				comments: params.commentId,
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
