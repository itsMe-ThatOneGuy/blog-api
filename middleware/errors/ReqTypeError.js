const AppError = require('./AppError');

class ReqTypeError extends AppError {
	constructor(message) {
		super(message || 'BAD ID IN REQUEST', 400);
	}
}

module.exports = ReqTypeError;
