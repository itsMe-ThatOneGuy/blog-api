const express = require('express');
const PrivateRouter = express.Router();
const { authentication } = require('./endpointAuth');
const { postsPrivate } = require('./posts');
const { userPrivate } = require('./user');

const initPrivateRouter = (router) => {
	authentication(router);
	postsPrivate(router);
	userPrivate(router);

	return router;
};

initPrivateRouter(PrivateRouter);

module.exports = PrivateRouter;
