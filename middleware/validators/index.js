const { validationResult } = require('express-validator');
const { usernameValidator } = require('./username');
const errors = require('../errors/index');

const validate = (req, res, next) => {
	const _errors = validationResult(req);
	if (_errors.isEmpty()) {
		return next();
	}
	const extractedErrors = [];
	_errors.array().map((err) => extractedErrors.push(err.msg));

	return next(new errors.AuthError(extractedErrors, 400));
};

module.exports = {
	validate,
};
