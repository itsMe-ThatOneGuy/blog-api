const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');

router.post('/refresh', controllers.authController.refresh);

module.exports = router;
