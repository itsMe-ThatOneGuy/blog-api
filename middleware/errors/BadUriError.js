const AppError = require('./AppError');

class BadUriError extends AppError {
	constructor(message) {
		super(message || 'BAD URI', 404);
	}
}

module.exports = BadUriError;
