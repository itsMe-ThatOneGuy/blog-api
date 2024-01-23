const mongodb = require('../../config/mongoConfigTesting');
const { CommentModel, UserModel } = require('../../models/index');

describe('Tests for the Comment data layer', () => {
	beforeAll(async () => {
		await mongodb.initializeMongoServer();
	});

	afterAll(async () => {
		await mongodb.stopMongoServer();
	});

	test('Should create a new comment', async () => {
		const user = new UserModel({
			username: 'testuser',
			password: 'password1',
		});
		const savedUser = await user.save();

		const data = {
			user: savedUser,
			body: 'This is a test comment',
		};

		const comment = new CommentModel(data);
		const savedComment = await comment.save();

		expect(savedComment._id).toBeDefined();
		expect(savedComment.user.username).toBe('testuser');
		expect(savedComment.body).toBe(data.body);
		expect(savedComment.commentDate).toBeDefined();
	});

	test('Should fail to create a comment without required fields', async () => {
		const comment = new CommentModel({});

		try {
			await comment.save();
		} catch (errors) {
			expect(errors.errors.user).toBeDefined();
			expect(errors.errors.body).toBeDefined();
		}
	});
});
