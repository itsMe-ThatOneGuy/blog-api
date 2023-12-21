const mongoose = require('mongoose');

module.exports = function (req, res, next) {
	if (!req.params.postId || !req.params.commentId || !req.params.userId) {
		next();
	} else {
		if (!mongoose.Types.ObjectId.isValid(req.params.postId)) {
			return res
				.status(400)
				.json({ statusCode: 400, message: 'POST ID IS NOT VALID' });
		} else {
			next();
		}
	}
};
