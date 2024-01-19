const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

var cookieExtractor = function (req) {
	var token = null;
	if (req && req.cookies) {
		token = req.cookies['jwt'];
	}
	return token;
};

const tokenOpts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_TOKEN_KEY,
	passReqToCallback: true,
};

const refreshOpts = {
	jwtFromRequest: cookieExtractor,
	secretOrKey: process.env.JWT_REFRESH_KEY,
};

module.exports = function (passport) {
	passport.use(
		new JwtStrategy(tokenOpts, (req, jwt_payload, done) => {
			try {
				req.user = jwt_payload;
				return done(null, jwt_payload);
			} catch (err) {
				return done(err, false);
			}
		}),
	);

	passport.use(
		'refresh',
		new JwtStrategy(refreshOpts, (jwt_payload, done) => {
			try {
				return done(null, jwt_payload);
			} catch (err) {
				return done(err, false);
			}
		}),
	);
};
