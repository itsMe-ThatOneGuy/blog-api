module.exports = (err, req, res, next) => {
	const errStatus = err.statusCode || 500;
	const errMsg = err.message || 'SOMETHING WENT WRONG';
	res.status(errStatus).json({
		success: false,
		status: errStatus,
		message: errMsg,
		stack: process.env.NODE_ENV === 'development' || undefined ? err.stack : {},
	});
};
