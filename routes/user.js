const controllers = require('../controllers/index');
const idTypeCheck = require('../middleware/idTypeCheck');

const userPublic = (router) => {
	router.get('/user/:userId', idTypeCheck, controllers.userController.get_user);

	router.post('/user/register', controllers.userController.register_user);

	router.post('/user/login', controllers.authController.login_user);

	return router;
};

const userPrivate = (router) => {
	router.post('/user/test', controllers.authController.test_auth);

	return router;
};

module.exports = {
	userPublic,
	userPrivate,
};
