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
		const _commentId = randomId(comment);
		await expect(async () => {
			await updateComment(_commentId, user.id, 'Some rando str');
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
