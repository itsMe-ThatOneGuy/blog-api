const AppError = require('./AppError');

class ReqTypeError extends AppError {
	constructor(message, status) {
		super(message || 'BAD ID ID REQUEST', status || 400);
	}
}

module.exports = ReqTypeError;
