const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;

const opts = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.JWT_TOKEN_KEY,
};

module.exports = function (passport) {
	passport.use(
		new JwtStrategy(opts, (jwt_payload, done) => {
			try {
				return done(null, jwt_payload);
			} catch (err) {
				return done(err, false);
			}
		}),
	);
};
