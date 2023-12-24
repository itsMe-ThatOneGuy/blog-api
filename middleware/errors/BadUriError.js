const AppError = require('./AppError');

class BadUri extends AppError {
	constructor(message) {
		super(message || 'BAD URI', 404);
	}
}

module.exports = BadUri;
