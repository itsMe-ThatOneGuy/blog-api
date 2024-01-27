const { body } = require('express-validator');
const { UserModel } = require('../../models/index');

const usernameValidator = () => {
	return [
		body('username')
			.trim()
			.isLength({ min: 1 })
			.withMessage('USERNAME MUST NOT BE EMPTY')
			.bail()
			.custom(async (value) => {
				return await UserModel.findOne({ username: value })
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

module.exports = usernameValidator;
