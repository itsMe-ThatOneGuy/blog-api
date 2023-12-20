const models = require('../models/index');
const asyncHandler = require('express-async-handler');
const passport = require('passport');

exports.get_all_posts = asyncHandler(async (req, res) => {
	const allPosts = await models.Post.find({})
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
	return res.status(200).json({ message: 'ALL POSTS', posts: allPosts });
});

exports.post_create_post = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		if (req.user.isAdmin) {
			const post = new models.Post({
				user: req.user.sub,
				title: req.body.title,
				body: req.body.body,
			});
			await post.save();
			return res.status(200).json({ message: 'CREATED POST', post: post });
		} else {
			return res.status(403).json({ message: 'NOT AUTHORIZED TO MAKE POSTS' });
		}
	}),
];

exports.get_single_post = asyncHandler(async (req, res) => {
	const post = await models.Post.findById(req.params.postId)
		.populate('user', 'username')
		.populate({
			path: 'comments',
			populate: { path: 'user', select: 'username' },
		});
	return res.status(200).json({ message: 'SELECTED POST', post: post });
});

exports.put_update_post = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		if (req.user.isAdmin) {
			const currentPost = await models.Post.findById(req.params.postId);

			if (currentPost === null) {
				return res.status(404).json({ message: 'COULD NOT FIND POST' });
			}

			const post = new models.Post({
				_id: req.params.postId,
				user: currentPost.user,
				title: req.body.title,
				body: req.body.body,
				comments: currentPost.comments,
				published: currentPost.published,
				postDate: currentPost.postDate,
			});

			const updatedPost = await models.Post.findByIdAndUpdate(
				req.params.postId,
				post,
				{},
			)
				.populate('user', 'username')
				.populate({
					path: 'comments',
					populate: { path: 'user', select: 'username' },
				});
			return res
				.status(200)
				.json({ message: 'UPDATED POST', post: updatedPost });
		} else {
			return res.status(403).json({ message: 'NOT AUTHORIZED TO UPDATE POST' });
		}
	}),
];

exports.delete_post = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		if (req.user.isAdmin) {
			const post = await models.Post.findById(req.params.postId)
				.populate('user', 'username')
				.populate({
					path: 'comments',
					populate: { path: 'user', select: 'username' },
				});

			if (post === null) {
				return res.status(404).json({ message: 'COULD NOT FIND POST' });
			}

			if (post.comments.length !== 0) {
				post.comments.forEach(async (comment) => {
					await models.Comment.findByIdAndDelete(comment._id);
				});
			}

			await models.Post.findByIdAndDelete(req.params.postId);
			return res.status(200).json({ message: 'Deleted Post', post: post });
		} else {
			return res.status(403).json({ message: 'NOT AUTHORIZED TO DELETE POST' });
		}
	}),
];

exports.change_published = [
	passport.authenticate('jwt', { session: false }),

	asyncHandler(async (req, res) => {
		if (req.user.isAdmin) {
			const currentPost = await models.Post.findById(req.params.postId);

			if (post === null) {
				return res.status(404).json({ message: 'COULD NOT FIND POST' });
			}

			const post = new models.Post({
				_id: req.params.postId,
				user: currentPost.user,
				title: currentPost.title,
				body: currentPost.body,
				comments: currentPost.comments,
				published: req.body.published,
				postDate: currentPost.postDate,
			});

			const updatedPost = await models.Post.findByIdAndUpdate(
				req.params.postId,
				post,
				{},
			)
				.populate('user', 'username')
				.populate({
					path: 'comments',
					populate: { path: 'user', select: 'username' },
				});
			return res
				.status(200)
				.json({ message: 'UPDATED POST', post: updatedPost });
		} else {
			return res.status(403).json({ message: 'NOT AUTHORIZED TO UPDATE POST' });
		}
	}),
];
