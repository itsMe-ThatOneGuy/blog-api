const controllers = require('../controllers/index');

const token = (router) => {
	router.post('/refresh', controllers.authController.refresh);

	return router;
};

module.exports = {
	token,
};
