const AppError = require('./AuthError');

class ValidationError extends AppError {
	constructor(message) {
		super(message || 'ERROR IN INPUT VALIDATION', 422);
	}
}

module.exports = ValidationError;
