const AppError = require('./AppError');

class PermissionError extends AppError {
	constructor(message) {
		super(message || 'NOT AUTHORIZED TO MAKE POSTS', 403);
	}
}

module.exports = PermissionError;
