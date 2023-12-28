const express = require('express');
const PrivateRouter = express.Router();
const endpointAuth = require('./endpointAuth');
const posts = require('./posts');
const user = require('./user');

const initPrivateRouter = (router) => {
	endpointAuth.authentication(router);
	posts.postsPrivate(router);
	user.userPrivate(router);

	return router;
};

initPrivateRouter(PrivateRouter);

module.exports = PrivateRouter;
