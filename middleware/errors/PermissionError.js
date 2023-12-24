const AppError = require('./AppError');

class PermissionError extends AppError {
	constructor(message) {
		super(message || 'NOT AUTHORIZED', 403);
	}
}

module.exports = PermissionError;
