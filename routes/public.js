const express = require('express');
const PublicRouter = express.Router();
const posts = require('./posts');
const user = require('./user');

const initPublicRouter = (router) => {
	posts.postsPublic(router);
	user.userPublic(router);

	return router;
};

initPublicRouter(PublicRouter);

module.exports = PublicRouter;
