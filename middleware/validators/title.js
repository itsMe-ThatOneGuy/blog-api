const { body } = require('express-validator');

const titleValidator = () => {
	return [
		body('title').isLength({ min: 1 }).withMessage('TITLE MUST NOT BE EMPTY'),
	];
};

module.exports = titleValidator;
