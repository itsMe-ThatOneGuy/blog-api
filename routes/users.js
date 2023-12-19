const express = require('express');
const router = express.Router();
const controllers = require('../controllers/index');

const passport = require('passport');

router.get('/', controllers.userController.get_user);

router.post('/refresh', controllers.authController.refresh);

router.post('/test', controllers.authController.test_auth);

router.post('/register', controllers.authController.register_user);

router.post('/login', controllers.authController.login_user);

module.exports = router;
