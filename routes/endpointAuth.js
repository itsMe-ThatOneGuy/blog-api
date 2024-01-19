const { userAuth } = require('../middleware/authCheck.js');

const authentication = (router) => {
	router.all('*', userAuth);

	return router;
};

module.exports = {
	authentication,
};
