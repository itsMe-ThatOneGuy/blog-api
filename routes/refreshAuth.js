const controllers = require('../controllers/index');

const refreshAuth = (router) => {
	router.all('*', controllers.authController.token_Auth);

	return router;
};

module.exports = {
	refreshAuth,
};
