const controllers = require('../controllers/index');
const idTypeCheck = require('../middleware/idTypeCheck');

const postsPublic = (router) => {
	router.get('/posts', controllers.postController.get_all_posts);

	router.get(
		'/posts/:postId',
		idTypeCheck,
		controllers.postController.get_single_post,
	);

	router.get(
		'/posts/:postId/comments',
		idTypeCheck,
		controllers.commentController.get_post_comments,
	);

	router.post(
		'/posts/:postId/comments',
		idTypeCheck,
		controllers.commentController.create_comment,
	);

	router.get(
		'/posts/:postId/comments/:commentId',
		idTypeCheck,
		controllers.commentController.get_single_comment,
	);

	router.put(
		'/posts/:postId/comments/:commentId',
		idTypeCheck,
		controllers.commentController.update_comment,
	);

	router.delete(
		'/posts/:postId/comments/:commentId',
		idTypeCheck,
		controllers.commentController.delete_comment,
	);
	return router;
};

const postsPrivate = (router) => {
	router.post('/posts', controllers.postController.create_post);

	router.put(
		'/posts/:postId',
		idTypeCheck,
		controllers.postController.update_post,
	);

	router.delete(
		'/posts/:postId',
		idTypeCheck,
		controllers.postController.delete_post,
	);

	router.put(
		'/posts/:postId/published',
		idTypeCheck,
		controllers.postController.change_published,
	);

	return router;
};

module.exports = {
	postsPublic,
	postsPrivate,
};
