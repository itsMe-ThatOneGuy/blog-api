const mongodb = require('../../config/mongoConfigTesting');
const CommentModel = require('../../models/comment');
const UserModel = require('../../models/user');
const { randomId } = require('../../utils/testUtils');

describe('Tests for the Comment datalayer', () => {
	beforeAll(async () => {
		await mongodb.initializeMongoServer();
	});

	afterAll(async () => {
		await mongodb.stopMongoServer();
	});

	const user = new UserModel.User({
		username: 'testUser',
		password: 'password1',
	});

	let comment;

	test('createComment creates a new comment and adds it to a post', async () => {
		comment = await CommentModel.createComment(user.id, 'test Comment body');
		expect(comment && typeof comment === 'object').toBe(true);
		expect(comment).toHaveProperty('user');
		expect(comment).toHaveProperty('body', 'test Comment body');
		expect(comment).toHaveProperty('commentDate');
	});

	test('createComment throws error if User is not provided', async () => {
		await expect(async () => {
			await CommentModel.createComment('', 'test Comment body');
		}).rejects.toThrow();
	});

	test('createComment throws error if Comment Body is not provided', async () => {
		await expect(async () => {
			await CommentModel.createComment(user.id);
		}).rejects.toThrow();
	});

	test('getSingleComment returns comment object from db using comment id', async () => {
		const _comment = await CommentModel.getSingleComment(comment.id);
		expect(_comment && typeof _comment === 'object').toBe(true);
		expect(_comment).toHaveProperty('user');
		expect(_comment).toHaveProperty('body', 'test Comment body');
		expect(_comment).toHaveProperty('commentDate');
	});

	test('getSingleComment throws error if id is not provided', async () => {
		await expect(async () => {
			await CommentModel.getSingleComment('');
		}).rejects.toThrow();
	});

	test('getSingleComment throws error if id is incorrect', async () => {
		const _commentId = randomId(comment);
		await expect(async () => {
			await CommentModel.getSingleComment(_commentId);
		}).rejects.toThrow('COMMENT NOT FOUND');
	});

	test('updateComment takes a new body str and updates the comment with it', async () => {
		const _comment = await CommentModel.updateComment(comment.id, 'updated');
		expect(_comment && typeof _comment == 'object').toBe(true);
		expect(_comment).toHaveProperty('user');
		expect(_comment).toHaveProperty('body', 'updated');
		expect(_comment).toHaveProperty('commentDate');
	});

	test('updateComment throws error if id is not provided', async () => {
		await expect(async () => {
			await CommentModel.updateComment('', 'Some random str');
		}).rejects.toThrow();
	});

	test('updateComment throws error if id is incorrect', async () => {
		const _commentId = randomId(comment);
		await expect(async () => {
			await CommentModel.updateComment(_commentId, 'Some rando str');
		}).rejects.toThrow('COMMENT NOT FOUND');
	});

	test('deleteComment deletes comment identified by id', async () => {
		const _comment = await CommentModel.deleteComment(comment.id);
		expect(_comment && typeof _comment == 'object').toBe(true);
		expect(_comment).toHaveProperty('user');
		expect(_comment).toHaveProperty('body', 'updated');
		expect(_comment).toHaveProperty('commentDate');
	});

	test('deleteComment throws error if id is not provided', async () => {
		await expect(async () => {
			await CommentModel.deleteComment('');
		}).rejects.toThrow();
	});

	test('deleteComment throws error if id is incorrect', async () => {
		const _commentId = randomId(comment);
		await expect(async () => {
			await CommentModel.deleteComment(_commentId);
		}).rejects.toThrow('COMMENT NOT FOUND');
	});
});
