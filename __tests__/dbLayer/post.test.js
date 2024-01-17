const mongodb = require('../../config/mongoConfigTesting');
const PostModel = require('../../models/post');
const UserModel = require('../../models/user');
const CommentModel = require('../../models/comment');
const { randomId } = require('../../utils/testUtils');

describe('Tests for Post datalayer', () => {
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

	let post;

	test('createPost creates a new post', async () => {
		post = await PostModel.createPosts(
			user.id,
			'POST TITLE',
			'This is the post body',
		);
		expect(post && typeof post === 'object').toBe(true);
		expect(post).toHaveProperty('user');
		expect(post).toHaveProperty('title', 'POST TITLE');
		expect(post).toHaveProperty('body', 'This is the post body');
		expect(post).toHaveProperty('comments');
		expect(post).toHaveProperty('isPublished', false);
		expect(post).toHaveProperty('postDate');
	});

	test('allPosts returns array of all the post objects', async () => {
		const _posts = await PostModel.allPosts();
		expect(_posts && typeof _posts === 'object').toBe(true);
		expect(_posts[0]).toHaveProperty('user');
		expect(_posts[0]).toHaveProperty('title', 'POST TITLE');
		expect(_posts[0]).toHaveProperty('body', 'This is the post body');
		expect(_posts[0]).toHaveProperty('comments');
		expect(_posts[0]).toHaveProperty('isPublished', false);
		expect(_posts[0]).toHaveProperty('postDate');
	});

	test('getSinglePost returns post identified by post ID', async () => {
		const _post = await PostModel.getSinglePost(post.id);
		expect(_post && typeof post === 'object').toBe(true);
		expect(_post).toHaveProperty('user');
		expect(_post).toHaveProperty('title', 'POST TITLE');
		expect(_post).toHaveProperty('body', 'This is the post body');
		expect(_post).toHaveProperty('comments');
		expect(_post).toHaveProperty('isPublished', false);
		expect(_post).toHaveProperty('postDate');
	});

	test('getSinglePost throws error when post id is not vaild', async () => {
		const postId = randomId(post);
		await expect(async () => {
			await PostModel.getSinglePost(postId);
		}).rejects.toThrow('POST NOT FOUND');
	});

	test('updatePost takes a new tite or body and used to update a post', async () => {
		console.log('NEED TO WRITE TESTS FOR updatePost after reworking it');
	});
	//WRITE ERRORS

	test('changePublished', async () => {
		const _post = await PostModel.changePublished(post.id, true);
		expect(_post && typeof post === 'object').toBe(true);
		expect(_post).toHaveProperty('user');
		expect(_post).toHaveProperty('title', 'POST TITLE');
		expect(_post).toHaveProperty('body', 'This is the post body');
		expect(_post).toHaveProperty('comments');
		expect(_post).toHaveProperty('postDate');
		expect(_post).toHaveProperty('isPublished', true);
	});

	test('changePublished throws error when post id is not vaild', async () => {
		const postId = randomId(post);
		await expect(async () => {
			await PostModel.changePublished(postId);
		}).rejects.toThrow('POST NOT FOUND');
	});

	test('changePublished throws error when status is not vaild bool', async () => {
		await expect(async () => {
			await PostModel.changePublished(post.id, 'Str');
		}).rejects.toThrow();
	});

	test('deletePost deletes and then returns the deleted post object', async () => {
		const _post = await PostModel.deletePost(post.id);
		expect(_post && typeof post === 'object').toBe(true);
		expect(_post).toHaveProperty('user');
		expect(_post).toHaveProperty('title', 'POST TITLE');
		expect(_post).toHaveProperty('body', 'This is the post body');
		expect(_post).toHaveProperty('comments');
		expect(_post).toHaveProperty('isPublished', true);
		expect(_post).toHaveProperty('postDate');
		await expect(async () => {
			await PostModel.getSinglePost(post.id);
		}).rejects.toThrow('POST NOT FOUND');
	});

	test('deletePost throws error when post id is not vaild', async () => {
		const postId = randomId(post);
		await expect(async () => {
			await PostModel.deletePost(postId);
		}).rejects.toThrow('POST NOT FOUND');
	});
});
