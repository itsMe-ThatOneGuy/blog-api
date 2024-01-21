const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer();

async function initializeMongoServer() {
	await mongoServer.start();
	const mongoUri = mongoServer.getUri();

	await mongoose.connect(mongoUri);

	mongoose.connection.on('error', (e) => {
		if (e.message.code === 'ETIMEDOUT') {
			console.log(e);
			mongoose.connect(mongoUri);
		}
		console.log(e);
	});
}

async function stopMongoServer() {
	await mongoose.connection.dropDatabase();
	await mongoose.connection.close();
	await mongoServer.stop();
}

module.exports = {
	initializeMongoServer,
	stopMongoServer,
};
