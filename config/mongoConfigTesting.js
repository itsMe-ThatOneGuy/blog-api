const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

const mongoServer = new MongoMemoryServer();

async function initializeMongoServer() {
	await mongoServer.start();
	const mongoUri = mongoServer.getUri();

	mongoose.connect(mongoUri);

	mongoose.connection.on('error', (e) => {
		if (e.message.code === 'ETIMEDOUT') {
			console.log(e);
			mongoose.connect(mongoUri);
		}
		console.log(e);
	});

	mongoose.connection.once('open', () => {
		console.log(`MongoDB successfully connected to ${mongoUri}`);
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
