const mongodb = require('../../config/mongoConfigTesting');
const {
	createComment,
	getSingleComment,
	updateComment,
	deleteComment,
} = require('../../services/comments');
const { UserModel, PostModel } = require('../../models/index');
const { randomId } = require('../../utils/testUtils');

describe('Tests for the Comment service layer', () => {
	let user, badUser;

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

	let testComment;

	test('createComment creates a new comment', async () => {
		const post = new PostModel({
			user: user.id,
			title: 'TEST POST',
			body: 'Test post body',
		});
		await post.save();

		const resources = await createComment(
			post.id,
			user.id,
			'test Comment body',
		);

		const { comment, updatedPost } = resources;
		testComment = comment;

		expect(comment && typeof comment === 'object').toBe(true);
		expect(comment).toHaveProperty('user');
		expect(comment).toHaveProperty('body', 'test Comment body');
		expect(comment).toHaveProperty('commentDate');

		expect(updatedPost && typeof updatedPost === 'object').toBe(true);
		expect(updatedPost).toHaveProperty('user');
		expect(updatedPost).toHaveProperty('title', 'TEST POST');
		expect(updatedPost).toHaveProperty('body', 'Test post body');
		expect(updatedPost).toHaveProperty('postDate');
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
		const _comment = await getSingleComment(testComment.id);
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
		const _commentId = randomId(testComment);
		await expect(async () => {
			await getSingleComment(_commentId);
		}).rejects.toThrow('COMMENT NOT FOUND');
	});

	test('updateComment throws error if user attempting is not the one who made the comemnt', async () => {
		await expect(async () => {
			await updateComment(testComment.id, badUser.id, 'Some random str');
		}).rejects.toThrow('NOT AUTHORIZED TO UPDATE COMMENT');
	});

	test('updateComment throws error if id is not provided', async () => {
		await expect(async () => {
			await updateComment(undefined, user.id, 'Some random str');
		}).rejects.toThrow('COMMENT NOT FOUND');
	});

	test('updateComment throws error if id is incorrect', async () => {
		const _commentId = randomId(testComment);
		await expect(async () => {
			await updateComment(_commentId, user.id, 'Some rando str');
		}).rejects.toThrow('COMMENT NOT FOUND');
	});

	test('updateComment takes a new body str and updates the comment with it', async () => {
		const _comment = await updateComment(testComment.id, user.id, 'updated');
		expect(_comment && typeof _comment === 'object').toBe(true);
		expect(_comment).toHaveProperty('user');
		expect(_comment).toHaveProperty('body', 'updated');
		expect(_comment).toHaveProperty('commentDate');
	});

	test('deleteComment throws error if user is not valid', async () => {
		await expect(async () => {
			await deleteComment(testComment.id, badUser.id, false);
		}).rejects.toThrow('NOT AUTHORIZED TO DELETE COMMENT');
	});

	test('deleteComment throws error if id is not provided', async () => {
		await expect(async () => {
			await deleteComment(undefined, user.id, undefined);
		}).rejects.toThrow('COMMENT NOT FOUND');
	});

	test('deleteComment throws error if id is incorrect', async () => {
		const _commentId = randomId(testComment);
		await expect(async () => {
			await deleteComment(_commentId, user.id, undefined);
		}).rejects.toThrow('COMMENT NOT FOUND');
	});

	test('deleteComment deletes comment identified by id', async () => {
		const _comment = await deleteComment(testComment.id, user.id, false);
		expect(_comment && typeof _comment === 'object').toBe(true);
		expect(_comment).toHaveProperty('user');
		expect(_comment).toHaveProperty('body', 'updated');
		expect(_comment).toHaveProperty('commentDate');
		await expect(async () => {
			await getSingleComment(testComment.id);
		}).rejects.toThrow('COMMENT NOT FOUND');
	});
});
