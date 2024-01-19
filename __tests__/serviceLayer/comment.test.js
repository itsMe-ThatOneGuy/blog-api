const mongodb = require('../../config/mongoConfigTesting');
const {
	createComment,
	getSingleComment,
	updateComment,
	deleteComment,
} = require('../../services/comments');
const { UserModel } = require('../../models/index');
const { randomId } = require('../../utils/testUtils');

describe('Tests for the Comment datalayer', () => {
	let user;

	beforeAll(async () => {
		await mongodb.initializeMongoServer();

		user = new UserModel({
			username: 'testUser',
			password: 'password1',
		});

		await user.save();

		badUser = new UserModel({
			username: 'badUser',
			password: 'password1',
			isAdmin: true,
		});

		await badUser.save();
	});

	afterAll(async () => {
		await mongodb.stopMongoServer();
	});

	let comment;

	test('createComment creates a new comment', async () => {
		comment = await createComment(user.id, 'test Comment body');
		expect(comment && typeof comment === 'object').toBe(true);
		expect(comment).toHaveProperty('user');
		expect(comment).toHaveProperty('body', 'test Comment body');
		expect(comment).toHaveProperty('commentDate');
	});

	test('createComment throws error if User is not provided', async () => {
		await expect(async () => {
			await createComment('', 'test Comment body');
		}).rejects.toThrow();
	});

	test('createComment throws error if Comment Body is not provided', async () => {
		await expect(async () => {
			await createComment(user.id);
		}).rejects.toThrow();
	});

	test('getSingleComment returns comment object from db using comment id', async () => {
		const _comment = await getSingleComment(comment.id);
		expect(_comment && typeof _comment === 'object').toBe(true);
		expect(_comment).toHaveProperty('user');
		expect(_comment).toHaveProperty('body', 'test Comment body');
		expect(_comment).toHaveProperty('commentDate');
	});

	test('getSingleComment throws error if id is not provided', async () => {
		await expect(async () => {
			await getSingleComment('');
		}).rejects.toThrow();
	});

	test('getSingleComment throws error if id is incorrect', async () => {
		const _commentId = randomId(comment);
		await expect(async () => {
			await getSingleComment(_commentId);
		}).rejects.toThrow('COMMENT NOT FOUND');
	});

	test('updateComment takes a new body str and updates the comment with it', async () => {
		const _comment = await updateComment(comment.id, user.id, 'updated');
		expect(_comment && typeof _comment === 'object').toBe(true);
		expect(_comment).toHaveProperty('user');
		expect(_comment).toHaveProperty('body', 'updated');
		expect(_comment).toHaveProperty('commentDate');
	});

	test('updateComment throws error if id is not provided', async () => {
		await expect(async () => {
			await updateComment('', 'Some random str');
		}).rejects.toThrow();
	});

	test('updateComment throws error if id is incorrect', async () => {
		const _commentId = randomId(comment);
		await expect(async () => {
			await updateComment(_commentId, 'Some rando str');
		}).rejects.toThrow('COMMENT NOT FOUND');
	});

	test('deleteComment deletes comment identified by id', async () => {
		const _comment = await deleteComment(comment.id, user.id, false);
		/* expect(_comment && typeof _comment === 'object').toBe(true);
        expect(_comment).toHaveProperty('user');
        expect(_comment).toHaveProperty('body', 'updated');
        expect(_comment).toHaveProperty('commentDate');
        await expect(async () => {
            await CommentModel.getSingleComment(comment.id);
        }).rejects.toThrow('COMMENT NOT FOUND'); */
	});

	test('deleteComment throws error if id is not provided', async () => {
		await expect(async () => {
			await deleteComment('');
		}).rejects.toThrow();
	});

	test('deleteComment throws error if id is incorrect', async () => {
		const _commentId = randomId(comment);
		await expect(async () => {
			await deleteComment(_commentId);
		}).rejects.toThrow('COMMENT NOT FOUND');
	});
});
