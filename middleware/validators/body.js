const { body } = require('express-validator');

const bodyValidator = () => {
	return [
		body('body').isLength({ min: 1 }).withMessage('BODY MUST NOT BE EMPTY'),
	];
};

module.exports = bodyValidator;
