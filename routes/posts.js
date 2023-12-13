const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');

router.get('/', postController.get_all_posts);

router.post('/', postController.post_create_post);

router.get('/:id', postController.get_single_post);

router.put('/:id', postController.put_update_post);

router.delete('/:id', postController.delete_post);

module.exports = router;
