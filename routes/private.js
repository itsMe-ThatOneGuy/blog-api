const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');
const idTypeCheck = require('../middleware/idTypeCheck');

//Create Post
router.post('/posts', controllers.postController.create_post);

//Update post
router.put(
	'/posts/:postId',
	idTypeCheck,
	controllers.postController.update_post,
);

//Delete Post
router.delete(
	'/posts/:postId',
	idTypeCheck,
	controllers.postController.delete_post,
);

//update published
router.put(
	'/posts/:postId/published',
	idTypeCheck,
	controllers.postController.change_published,
);

//Create a comment
router.post(
	'/posts/:postId/comments',
	idTypeCheck,
	controllers.commentController.create_comment,
);

//Update comment
router.put(
	'/posts/:postId/comments/:commentId',
	idTypeCheck,
	controllers.commentController.update_comment,
);

//Delete comment
router.delete(
	'/posts/:postId/comments/:commentId',
	idTypeCheck,
	controllers.commentController.delete_comment,
);

module.exports = router;
