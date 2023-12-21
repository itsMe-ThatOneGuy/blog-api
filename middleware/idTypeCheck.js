const mongoose = require('mongoose');

module.exports = function (req, res, next) {
	const idArray = Object.values(req.params);
	if (idArray.length === 0) {
		return next();
	}

	for (id of idArray) {
		if (!mongoose.Types.ObjectId.isValid(id)) {
			return res
				.status(400)
				.json({ statusCode: 400, message: 'ID IS NOT VALID' });
		}
	}

	return next();
};
