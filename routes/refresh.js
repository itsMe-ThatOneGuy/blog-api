const express = require('express');
const TokenRouter = express.Router();
const refreshAuth = require('./refreshAuth');
const token = require('./token');

const initTokenRouter = (router) => {
	refreshAuth.refreshAuth(router);
	token.token(router);

	return router;
};

initTokenRouter(TokenRouter);

module.exports = TokenRouter;
