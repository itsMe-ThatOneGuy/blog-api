const models = require('../models/index');
const asyncHandler = require('express-async-handler');

exports.get_user = asyncHandler(async (req, res) => {
	models.User.findById(req.params.id);
	return res.json({ id: user._id, username: username });
});
