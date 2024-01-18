const asyncHandler = require('express-async-handler');
const errors = require('../middleware/errors/index');
const { PostModel } = require('../models/index');

const allPosts = asyncHandler(async () => {
	return await PostModel.find({})
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

const createPosts = asyncHandler(async (sub, title, body) => {
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

//I MIGHT NEED TO REWORK THIS
const updatePost = asyncHandler(async (id, title, body) => {
	//MOVE TO AN ADMIN CHECK
	/* if (!admin)
        throw new errors.PermissionError('NOT AUTHORIZED TO UPDATE POSTS');
*/
	await getSinglePost(id);

	return await PostModel.findByIdAndUpdate(
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

const deletePost = asyncHandler(async (id) => {
	//MOVE TO ADMIN CHECk
	/* if (!admin)
        throw new errors.PermissionError('NOT AUTHORIZED TO DELETE POSTS'); */
	await getSinglePost(id);

	return await PostModel.findByIdAndDelete(id)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
});

const changePublished = async (id, status) => {
	//MOVE TO ADMIN CHECk
	/* if (!admin)
        throw new errors.PermissionError(
            'NOT AUTHORIZED TO CHANGE POST PUBLISH STATUS',
        ); */

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
	createPosts,
	getSinglePost,
	updatePost,
	deletePost,
	changePublished,
	updatePostComments,
};
