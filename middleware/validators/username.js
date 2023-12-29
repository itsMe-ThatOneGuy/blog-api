const { body } = require('express-validator');

const usernameValidator = () => {
	return [
		body('username')
			.trim()
			.isLength({ min: 1 })
			.withMessage('USERNAME MUST NOT BE EMPTY')
			.custom(async (value) => {
				return User.findOne({ username: value })
					.exec()
					.then((name) => {
						if (name !== null) {
							return Promise.reject();
						}
					});
			})
			.withMessage('USERNAME ALREADY TAKEN'),
	];
};

module.exports = {
	usernameValidator,
};
