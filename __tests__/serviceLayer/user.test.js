const mongodb = require('../../config/mongoConfigTesting');
const {
	registerUser,
	getUserById,
	getUserByName,
} = require('../../services/user');
const { randomId } = require('../../utils/testUtils');

describe('Tests for the User datalayer', () => {
	beforeAll(async () => {
		await mongodb.initializeMongoServer();
	});

	afterAll(async () => {
		mongodb.stopMongoServer();
	});

	let user;

	test('registerUser should add a new user to DB', async () => {
		user = await registerUser('testUser', 'password1');
		expect(user && typeof user === 'object').toBe(true);
		expect(user).toHaveProperty('username', 'testUser');
		expect(user).toHaveProperty('password');
		expect(user).toHaveProperty('isAdmin', false);
	});

	test('registerUser returns Error when duplicate username is used', async () => {
		await expect(async () => {
			await registerUser('testUser', 'password1');
		}).rejects.toThrow();
	});

	test('registerUser returns Error when no password is provided', async () => {
		await expect(async () => {
			await registerUser('testUser');
		}).rejects.toThrow();
	});

	test('getUserById returns the user obj from the DB using the user ID', async () => {
		const _user = await getUserById(user.id);
		expect(_user && typeof _user === 'object').toBe(true);
		expect(_user).toHaveProperty('username', 'testUser');
		expect(_user).toHaveProperty('password');
		expect(_user).toHaveProperty('isAdmin', false);
	});

	test('getUserById returns Error when id is empty', async () => {
		await expect(async () => {
			await getUserByName('');
		}).rejects.toThrow();
	});

	test('getUserById returns Error when id is wrong', async () => {
		const _userId = randomId(user);
		await expect(async () => {
			await getUserByName(_userId);
		}).rejects.toThrow('USER NOT FOUND');
	});

	test('getUserByName returns the user obj from DB using the username', async () => {
		const _user = await getUserByName('testUser');
		expect(_user && typeof _user === 'object').toBe(true);
		expect(_user).toHaveProperty('username', 'testUser');
		expect(_user).toHaveProperty('password');
		expect(_user).toHaveProperty('isAdmin', false);
	});

	test('getUserByName returns ResourceError when not locating user', async () => {
		await expect(async () => {
			await getUserByName('testUser1');
		}).rejects.toThrow('USER NOT FOUND');
	});
});
