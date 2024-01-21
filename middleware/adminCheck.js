const errors = require('./errors/index');

module.exports = function (req, res, next) {
	if (!req.user.isAdmin) {
		throw new errors.PermissionError();
	}

	return next();
};
