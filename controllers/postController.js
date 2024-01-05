const errors = require('../middleware/errors/index');
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
		});
	} catch (err) {
		return next(err);
	}
});

exports.create_post = asyncHandler(async (req, res, next) => {
	try {
		if (!req.user.isAdmin)
			return next(new errors.PermissionError('NOT AUTHORIZED TO MAKE POSTS'));

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
		if (!req.user.isAdmin)
			return next(new errors.PermissionError('NOT AUTHORIZED TO UPDATE POSTS'));

		const updatedPost = await services.postServices.updatePost(
			req.params,
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
		if (!req.user.isAdmin)
			return next(new errors.PermissionError('NOT AUTHORIZED TO DELETE POSTS'));

		const post = await services.postServices.deletePost(req.params);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'Deleted Post',
			post: post,
		});
	} catch (err) {
		return next(err);
	}
});

exports.change_published = asyncHandler(async (req, res, next) => {
	try {
		if (!req.user.isAdmin)
			return next(
				new errors.PermissionError(
					'NOT AUTHORIZED TO CHANGE POST PUBLISH STATUS',
				),
			);

		const updatedPost = await services.postServices.deletePost(
			req.params,
			req.body,
		);

		return res.status(200).json({
			success: true,
			status: 200,
			message: 'UPDATED POST PUBLISH STATUS',
			post: updatedPost,
		});
	} catch (err) {
		return next(err);
	}
});
