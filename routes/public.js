const express = require('express');
const PublicRouter = express.Router();
const { postsPublic } = require('./posts');
const { userPublic } = require('./user');

const initPublicRouter = (router) => {
	postsPublic(router);
	userPublic(router);

	return router;
};

initPublicRouter(PublicRouter);

module.exports = PublicRouter;
