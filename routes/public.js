const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');
const idTypeCheck = require('../middleware/idTypeCheck');

router.get('/user/:userId', idTypeCheck, controllers.userController.get_user);

router.post('/user/test', controllers.authController.test_auth);

router.post('/user/register', controllers.authController.register_user);

router.post('/user/login', controllers.authController.login_user);

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

module.exports = router;
