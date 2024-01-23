const mongodb = require('../../config/mongoConfigTesting');
const PostModel = require('../../models/post');
const UserModel = require('../../models/user');

describe('Tests for the Post data layer', () => {
	beforeAll(async () => {
		await mongodb.initializeMongoServer();
	});

	afterAll(async () => {
		mongodb.stopMongoServer();
	});

	test('Should create a new post', async () => {
		const user = new UserModel({
			username: 'testuser',
			password: 'password1',
		});
		const savedUser = await user.save();

		const data = {
			title: 'Test Post',
			body: 'This is a test post',
			user: savedUser,
		};

		const post = new PostModel(data);
		const savedPost = await post.save();

		expect(savedPost._id).toBeDefined();
		expect(savedPost.user.username).toBe('testuser');
		expect(savedPost.title).toBe(data.title);
		expect(savedPost.body).toBe(data.body);
		expect(savedPost.comments).toBeDefined();
		expect(savedPost.isPublished).toBe(false);
		expect(savedPost.postDate).toBeDefined();
	});

	test('Should fail to create a post without required fields', async () => {
		const post = new PostModel({});

		try {
			await post.save();
		} catch (error) {
			expect(error.errors.user).toBeDefined();
			expect(error.errors.title).toBeDefined();
			expect(error.errors.body).toBeDefined();
		}
	});
});
