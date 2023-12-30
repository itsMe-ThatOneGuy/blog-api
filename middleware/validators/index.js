const { validationResult } = require('express-validator');
const usernameValidator = require('./username');
const passwordValidator = require('./password');
const titleValidator = require('./title');
const bodyValidator = require('./body');
const publishValidator = require('./publish');
const errors = require('../errors/index');

const validate = (req, res, next) => {
	const _errors = validationResult(req);
	if (_errors.isEmpty()) {
		return next();
	}
	const extractedErrors = [];
	_errors.array().map((err) => extractedErrors.push(err.msg));

	return next(new errors.ValidationError(extractedErrors, 422));
};

module.exports = {
	validate,
	usernameValidator,
	passwordValidator,
	titleValidator,
	bodyValidator,
	publishValidator,
};
