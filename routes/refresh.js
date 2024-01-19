const express = require('express');
const refreshRouter = express.Router();
const { refreshToken } = require('./refreshToken');

const initRefreshRouter = (router) => {
	refreshToken(router);

	return router;
};

initRefreshRouter(refreshRouter);

module.exports = refreshRouter;
