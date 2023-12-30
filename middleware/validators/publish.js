const { body } = require('express-validator');

const publishValidator = () => {
	return [
		body('isPublished')
			.isBoolean()
			.withMessage('PUBLISHED MUST ONLY BE TRUE OR FALSE'),
	];
};

module.exports = publishValidator;
