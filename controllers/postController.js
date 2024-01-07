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
	try {
		const post = await services.postServices.createPost(req.user, req.body);

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
	try {
		const post = await services.postServices.getSinglePost(req.params);

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
	try {
		const updatedPost = await services.postServices.updatePost(
			req.params,
			req.user,
			req.body,
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
	try {
		const post = await services.postServices.deletePost(req.params, req.user);

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
	try {
		const updatedPost = await services.postServices.deletePost(
			req.params,
			req.user,
			req.body,
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
