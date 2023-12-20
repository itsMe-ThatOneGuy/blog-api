const models = require('../models/index');
const asyncHandler = require('express-async-handler');

exports.get_user = asyncHandler(async (req, res) => {
	if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
		return res
			.status(400)
			.json({ statusCode: 400, message: 'USER ID IS NOT VALID' });
	}
	models.User.findById(req.params.userId);
	return res.status(200).json({
		statusCode: 200,
		message: 'SELECTED USER',
		user: { id: user._id, username: username },
	});
});
