require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const ErrorHandler = require('./middleware/ErrorHandler');

const errors = require('./middleware/errors/index');
const models = require('./models/index');
const routes = require('./routes/index');

const app = express();

models.connectToDatabase();

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
