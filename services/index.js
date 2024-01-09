const postServices = require('./posts');
const commentServices = require('./comments');
const authServices = require('./auth');
const userServices = require('./user');

module.exports = {
	postServices,
	commentServices,
	authServices,
	userServices,
};
