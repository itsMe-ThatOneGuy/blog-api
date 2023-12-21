const models = require('../models/index');
const asyncHandler = require('express-async-handler');

exports.get_user = asyncHandler(async (req, res) => {
	await models.User.findById(req.params.userId);
	return res.status(200).json({
		statusCode: 200,
		message: 'SELECTED USER',
		user: { id: user._id, username: username },
	});
});
