const controllers = require('../controllers/index');

const authentication = (router) => {
	router.all('*', controllers.authController.user_Auth);

	return router;
};

module.exports = {
	authentication,
};
