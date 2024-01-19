const controllers = require('../controllers/index');
const { tokenAuth } = require('../middleware/authCheck');

const refreshToken = (router) => {
	router.post('/refresh', tokenAuth, controllers.authController.refresh);

	return router;
};

module.exports = {
	refreshToken,
};
