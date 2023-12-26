require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ErrorHandler = require('./middleware/ErrorHandler');

const errors = require('./middleware/errors/index');
const models = require('./models/index');
const routes = require('./routes/index');

const passport = require('passport');
const initPassport = require('./helpers/passport');

const app = express();

models.connectToDatabase();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

initPassport(passport);
app.use('/public', routes.public);
app.use(
	'/private',
	passport.authenticate('jwt', { session: false }),
	routes.private,
);
app.use(
	'/token',
	passport.authenticate('refresh', { session: false }),
	routes.refresh,
);
app.use((req, res, next) => {
	next(new errors.BadUriError());
});
app.use(ErrorHandler);

module.exports = app;
