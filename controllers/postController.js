const errors = require('../middleware/errors/index');
const models = require('../models/index');
const asyncHandler = require('express-async-handler');

exports.get_all_posts = asyncHandler(async (req, res, next) => {
	try {
		const allPosts = await models.Post.find({})
			.populate('user', 'username')
			.populate({
				path: 'comments',
				populate: { path: 'user', select: 'username' },
			});

		return res
			.status(200)
			.json({ statusCode: 200, message: 'ALL POSTS', posts: allPosts });
	} catch (err) {
		return next(err);
	}
});

exports.create_post = asyncHandler(async (req, res, next) => {
	try {
		if (!req.user.isAdmin)
			return next(new errors.PermissionError('NOT AUTHORIZED TO MAKE POSTS'));

		const post = new models.Post({
			user: req.user.sub,
			title: req.body.title,
			body: req.body.body,
		});
		await post.save();

		return res
			.status(200)
			.json({ statusCode: 200, message: 'CREATED POST', post: post });
	} catch (err) {
		return next(err);
	}
});

exports.get_single_post = asyncHandler(async (req, res, next) => {
	try {
		const post = await models.Post.findById(req.params.postId)
			.populate('user', 'username')
			.populate({
				path: 'comments',
				populate: { path: 'user', select: 'username' },
			});
		if (post === null)
			return next(new errors.ResourceError('COULD NOT FIND POST', 404));

		return res
			.status(200)
			.json({ statusCode: 200, message: 'SELECTED POST', post: post });
	} catch (err) {
		return next(err);
	}
});

exports.update_post = asyncHandler(async (req, res, next) => {
	try {
		if (!req.user.isAdmin)
			return next(new errors.PermissionError('NOT AUTHORIZED TO UPDATE POSTS'));

		const currentPost = await models.Post.findById(req.params.postId);
		if (currentPost === null)
			return next(new errors.ResourceError('COULD NOT FIND POST', 404));

		const updatedPost = await models.Post.findByIdAndUpdate(
			req.params.postId,
			{ $set: { title: req.body.title, body: req.body.body } },
			{ new: true },
		)
			.populate('user', 'username')
			.populate({
				path: 'comments',
				populate: { path: 'user', select: 'username' },
			});

		return res
			.status(200)
			.json({ statusCode: 200, message: 'UPDATED POST', post: updatedPost });
	} catch (err) {
		return next(err);
	}
});

exports.delete_post = asyncHandler(async (req, res, next) => {
	try {
		if (!req.user.isAdmin)
			return next(new errors.PermissionError('NOT AUTHORIZED TO DELETE POSTS'));

		const post = await models.Post.findById(req.params.postId)
			.populate('user', 'username')
			.populate({
				path: 'comments',
				populate: { path: 'user', select: 'username' },
			});
		if (post === null)
			return next(new errors.ResourceError('COULD NOT FIND POST', 404));

		if (post.comments.length !== 0) {
			post.comments.forEach(async (comment) => {
				await models.Comment.findByIdAndDelete(comment._id);
			});
		}

		await models.Post.findByIdAndDelete(req.params.postId);

		return res
			.status(200)
			.json({ statusCode: 200, message: 'Deleted Post', post: post });
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

		const currentPost = await models.Post.findById(req.params.postId);
		if (currentPost === null)
			return next(new errors.ResourceError('COULD NOT FIND POST', 404));

		const updatedPost = await models.Post.findByIdAndUpdate(
			req.params.postId,
			{ $set: { isPublished: req.body.isPublished } },
			{ new: true },
		)
			.populate('user', 'username')
			.populate({
				path: 'comments',
				populate: { path: 'user', select: 'username' },
			});

		return res.status(200).json({
			statusCode: 200,
			message: 'UPDATED POST PUBLISH STATUS',
			post: updatedPost,
		});
	} catch (err) {
		return next(err);
	}
});
