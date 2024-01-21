const controllers = require('../controllers/index');
const idTypeCheck = require('../middleware/idTypeCheck');
const validator = require('../middleware/validators/index');
const adminCheck = require('../middleware/adminCheck');

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

	router.get(
		'/posts/:postId/comments/:commentId',
		idTypeCheck,
		controllers.commentController.get_single_comment,
	);

	return router;
};

const postsPrivate = (router) => {
	router.post(
		'/posts',
		adminCheck,
		validator.titleValidator(),
		validator.bodyValidator(),
		validator.validate,
		controllers.postController.create_post,
	);

	router.put(
		'/posts/:postId',
		adminCheck,
		idTypeCheck,
		/* validator.titleValidator(),
        validator.bodyValidator(),
        validator.validate, */
		controllers.postController.update_post,
	);

	router.delete(
		'/posts/:postId',
		adminCheck,
		idTypeCheck,
		controllers.postController.delete_post,
	);

	router.put(
		'/posts/:postId/published',
		adminCheck,
		idTypeCheck,
		validator.publishValidator(),
		validator.validate,
		controllers.postController.change_published,
	);

	router.post(
		'/posts/:postId/comments',
		idTypeCheck,
		validator.bodyValidator(),
		validator.validate,
		controllers.commentController.create_comment,
	);

	router.put(
		'/posts/:postId/comments/:commentId',
		idTypeCheck,
		validator.bodyValidator(),
		validator.validate,
		controllers.commentController.update_comment,
	);

	router.delete(
		'/posts/:postId/comments/:commentId',
		idTypeCheck,
		controllers.commentController.delete_comment,
	);

	return router;
};

module.exports = {
	postsPublic,
	postsPrivate,
};
