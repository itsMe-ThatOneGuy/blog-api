const AppError = require('./AppError');

class ResourceError extends AppError {
	constructor(message) {
		super(message || 'NO RESOURCE FOUND', 404);
	}
}

module.exports = ResourceError;
