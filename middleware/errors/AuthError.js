const AppError = require('./AppError');

class AuthError extends AppError {
	constructor(message) {
		super(message || 'AUTHENTICATION ERROR', 400);
	}
}

module.exports = AuthError;
