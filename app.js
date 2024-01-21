require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compression = require('compression');
const helmet = require('helmet');

const ErrorHandler = require('./middleware/ErrorHandler');
const errors = require('./middleware/errors/index');
const { connectToDatabase } = require('./config/mongoConfig');
const routes = require('./routes/index');

const app = express();
app.disable('x-powered-by');
app.use(helmet());
app.use(compression());

connectToDatabase();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/public', routes.public);
app.use('/private', routes.private);
app.use('/token', routes.refresh);
app.use((req, res, next) => {
	next(new errors.BadUriError());
});
app.use(ErrorHandler);

module.exports = app;
