const mongoose = require('mongoose');
const errors = require('./errors/index');

module.exports = function (req, res, next) {
	const idArray = Object.values(req.params);
	if (idArray.length === 0) {
		return next();
	}

	for (id of idArray) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			throw new errors.ReqTypeError();
		}
	}

	return next();
};
