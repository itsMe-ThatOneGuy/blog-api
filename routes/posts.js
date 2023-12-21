const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');

router.get('/', controllers.postController.get_all_posts);

router.post('/', controllers.postController.create_post);

router.get('/:postId', controllers.postController.get_single_post);

router.put('/:postId/published', controllers.postController.change_published);

router.get(
	'/:postId/comments',
	controllers.commentController.get_post_comments,
);

router.get(
	'/:postId/comments/:commentId',
	controllers.commentController.get_single_comment,
);

router.post('/:postId/comments', controllers.commentController.create_comment);

router.put('/:postId', controllers.postController.update_post);

router.put(
	'/:postId/comments/:commentId',
	controllers.commentController.update_comment,
);

router.delete('/:postId', controllers.postController.delete_post);

router.delete(
	'/:postId/comments/:commentId',
	controllers.commentController.delete_comment,
);

module.exports = router;
