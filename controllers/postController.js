const services = require('../services/index');
const asyncHandler = require('express-async-handler');

exports.get_all_posts = asyncHandler(async (req, res, next) => {
	try {
		const allPosts = await services.postServices.allPosts();

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'ALL POSTS',
			posts: allPosts,
			total: allPosts.length,
		});
	} catch (err) {
		return next(err);
	}
});

exports.create_post = asyncHandler(async (req, res, next) => {
	const { sub } = req.user;
	const { title, body } = req.body;

	try {
		const post = await services.postServices.createPost(sub, title, body);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'CREATED POST',
			post: post,
		});
	} catch (err) {
		return next(err);
	}
});

exports.get_single_post = asyncHandler(async (req, res, next) => {
	const { postId } = req.params;

	try {
		const post = await services.postServices.getSinglePost(postId);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'SELECTED POST',
			post: post,
		});
	} catch (err) {
		return next(err);
	}
});

exports.update_post = asyncHandler(async (req, res, next) => {
	const { isAdmin } = req.user;
	const { postId } = req.params;
	const { title, body } = req.body;

	try {
		const updatedPost = await services.postServices.updatePost(
			isAdmin,
			postId,
			title,
			body,
		);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'UPDATED POST',
			post: updatedPost,
		});
	} catch (err) {
		return next(err);
	}
});

exports.delete_post = asyncHandler(async (req, res, next) => {
	const { isAdmin } = req.user;
	const { postId } = req.params;

	try {
		const post = await services.postServices.deletePost(postId, isAdmin);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'DELETED POST',
			post: post,
		});
	} catch (err) {
		return next(err);
	}
});

exports.change_published = asyncHandler(async (req, res, next) => {
	const { postId } = req.params;
	const { isAdmin } = req.user;
	const { isPublished } = req.body;

	try {
		const updatedPost = await services.postServices.deletePost(
			isAdmin,
			postId,
			isPublished,
		);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'POST PUBLISH STATUS UPDATED',
			post: updatedPost,
		});
	} catch (err) {
		return next(err);
	}
});
