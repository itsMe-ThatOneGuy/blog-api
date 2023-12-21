//const createError = require('http-errors');
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
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
app.use(
	'/private',
	passport.authenticate('jwt', { session: false }),
	routes.private,
);
app.use('/public', routes.public);
app.use(
	'/token',
	passport.authenticate('refresh', { session: false }),
	routes.refresh,
);

/* // catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});
*/
module.exports = app;
