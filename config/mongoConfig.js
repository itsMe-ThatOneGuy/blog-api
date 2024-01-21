const mongoose = require('mongoose');

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
};
