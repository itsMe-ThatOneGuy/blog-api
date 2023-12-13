const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');

router.get('/', commentController.get_all_comments);

router.post('/', commentController.post_create_comment);

router.get('/:id', commentController.get_single_comment);

router.put('/:id', commentController.put_update_comment);

router.delete('/:id', commentController.delete_comment);

module.exports = router;
