const passport = require('passport');
const initPassport = require('../config/passport');

initPassport(passport);

exports.userAuth = (req, res, next) => {
	passport.authenticate('jwt', { session: false }, (err, user) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			throw new errors.AuthError();
		}
		return next();
	})(req, res, next);
};

exports.tokenAuth = (req, res, next) => {
	passport.authenticate('refresh', function (err, user) {
		if (err) {
			return next(err);
		}
		return next();
	})(req, res, next);
};
