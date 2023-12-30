const mongoose = require('mongoose');
const errors = require('./errors/index');

module.exports = function (req, res, next) {
	const idArray = Object.values(req.params);
	idArray.filter((param) => {
		param.includes('id');
	});
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
