const mongoose = require('mongoose');
const User = require('./user');
const PostModel = require('./post');
const Comment = require('./comment');

mongoose.set('bufferCommands', false);

async function connectToDatabase() {
	try {
		await mongoose.connect(
			process.env.NODE_ENV !== 'development'
				? process.env.MONGODB_URI
				: process.env.MONGODB_URI_DEV,
		);
		console.log('Successfully connected to database');
	} catch (err) {
		throw new Error();
	}
}

mongoose.connection.on('error', () => {
	throw new Error();
});

module.exports = {
	connectToDatabase,
	User,
	PostModel,
	Comment,
};
