const mongoose = require('mongoose');
const User = require('./user');
const Post = require('./post');
const Comment = require('./comment');

async function connectToDatabase() {
	try {
		await mongoose.connect(
			process.env.NODE_ENV !== undefined
				? process.env.MONGODB_URI
				: process.env.MONGODB_URI_DEV,
		);
		console.log('Successfully connected to database');
	} catch (err) {
		console.error(err);
	}
}

module.exports = {
	connectToDatabase,
	User,
	Post,
	Comment,
};
