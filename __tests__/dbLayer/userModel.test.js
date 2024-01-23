const mongodb = require('../../config/mongoConfigTesting');
const { UserModel } = require('../../models/index');

describe('Tests for the User data layer', () => {
	beforeAll(async () => {
		await mongodb.initializeMongoServer();
	});

	afterAll(async () => {
		await mongodb.stopMongoServer();
	});

	test('should create a new user', async () => {
		const data = {
			username: 'testuser',
			password: 'password1',
		};

		const user = new UserModel(data);
		const savedUser = await user.save();

		expect(savedUser._id).toBeDefined();
		expect(savedUser.username).toBe(data.username);
		expect(savedUser.password).toBe(data.password);
		expect(savedUser.isAdmin).toBe(false);
	});

	test('should fail to create a user without required fields', async () => {
		const user = new UserModel({});

		try {
			await user.save();
		} catch (error) {
			expect(error.errors.username).toBeDefined();
			expect(error.errors.password).toBeDefined();
		}
	});
});
