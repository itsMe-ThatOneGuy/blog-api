const controllers = require('../controllers/index');

const authentication = (router) => {
	router.all('*', controllers.authController.userAuth);

	return router;
};

module.exports = {
	authentication,
};
