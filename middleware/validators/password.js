const { body } = require('express-validator');

const passwordValidator = () => {
	return [
		body('password')
			.isLength({ min: 8 })
			.withMessage('PASSWORD MUST CONTAIN AT LEAST 8 CHARACTERS')
			.bail()
			.matches('[0-9]')
			.withMessage('PASSWORD MUST CONTAIN A NUMBER')
			.bail()
			.matches('[A-Z]')
			.withMessage('PASSWORD MUST CONTAIN AN UPPERCASE LETTER')
			.bail()
			.trim()
			.escape(),
		body('confirm-password')
			.custom((confirmPassword, { req }) => {
				return req.body.password === confirmPassword;
			})
			.withMessage('PASSWORDS MUST MATCH'),
	];
};

module.exports = passwordValidator;
