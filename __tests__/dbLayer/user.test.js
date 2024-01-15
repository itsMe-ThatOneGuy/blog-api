const mongodb = require('../../config/mongoConfigTesting');
const userModel = require('../../models/user');

describe('Tests for the User datalayer', () => {
	beforeAll(async () => {
		await mongodb.initializeMongoServer();
	});

	afterAll(async () => {
		mongodb.stopMongoServer();
	});

	let user;

	test('registerUser should add a new user to DB', async () => {
		user = await userModel.registerUser('testUser', 'password1');
		expect(user && typeof user === 'object').toBe(true);
		expect(user).toHaveProperty('username', 'testUser');
		expect(user).toHaveProperty('password');
		expect(user).toHaveProperty('isAdmin', false);
	});

	test('registerUser returns Error when duplicate username is used', async () => {
		await expect(async () => {
			await userModel.registerUser('testUser', 'password1');
		}).rejects.toThrow(
			'E11000 duplicate key error collection: test.users index: username_1 dup key: { username: "testUser" }',
		);
	});

	test('getUserById returns the user obj from the DB using the user ID', async () => {
		const _user = await userModel.getUserById(user.id);
		expect(_user && typeof user === 'object').toBe(true);
		expect(_user).toHaveProperty('username', 'testUser');
		expect(_user).toHaveProperty('password');
		expect(_user).toHaveProperty('isAdmin', false);
	});

	test('getUserByName returns ResourceError when not locating user', async () => {
		await expect(async () => {
			await userModel.getUserByName(user.id);
		}).rejects.toThrow('USER NOT FOUND');
	});

	test('getUserByName returns the user obj from DB using the username', async () => {
		const _user = await userModel.getUserByName('testUser');
		expect(_user && typeof user === 'object').toBe(true);
		expect(_user).toHaveProperty('username', 'testUser');
		expect(_user).toHaveProperty('password');
		expect(_user).toHaveProperty('isAdmin', false);
	});

	test('getUserByName returns ResourceError when not locating user', async () => {
		await expect(async () => {
			await userModel.getUserByName('testUser1');
		}).rejects.toThrow('USER NOT FOUND');
	});
});
