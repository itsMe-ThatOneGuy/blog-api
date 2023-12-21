const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');
const idTypeCheck = require('../middleware/idTypeCheck');

router.get('/', controllers.postController.get_all_posts);

router.post('/', controllers.postController.create_post);

router.get('/:postId', idTypeCheck, controllers.postController.get_single_post);

router.put(
	'/:postId/published',
	idTypeCheck,
	controllers.postController.change_published,
);

router.get(
	'/:postId/comments',
	idTypeCheck,
	controllers.commentController.get_post_comments,
);

router.get(
	'/:postId/comments/:commentId',
	idTypeCheck,
	controllers.commentController.get_single_comment,
);

router.post(
	'/:postId/comments',
	idTypeCheck,
	controllers.commentController.create_comment,
);

router.put('/:postId', idTypeCheck, controllers.postController.update_post);

router.put(
	'/:postId/comments/:commentId',
	idTypeCheck,
	controllers.commentController.update_comment,
);

router.delete('/:postId', idTypeCheck, controllers.postController.delete_post);

router.delete(
	'/:postId/comments/:commentId',
	idTypeCheck,
	controllers.commentController.delete_comment,
);

module.exports = router;
