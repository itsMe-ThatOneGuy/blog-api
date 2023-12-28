const controllers = require('../controllers/index');

const refreshAuth = (router) => {
	router.all('*', controllers.authController.tokenAuth);

	return router;
};

module.exports = {
	refreshAuth,
};
