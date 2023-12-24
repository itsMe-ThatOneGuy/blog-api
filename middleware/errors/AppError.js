class AppError extends Error {
	constructor(message, status) {
		super();

		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;

		this.message = message || 'SOMETIHNG WENT WRONG.';

		this.statusCode = status || 500;
	}
}

module.exports = AppError;