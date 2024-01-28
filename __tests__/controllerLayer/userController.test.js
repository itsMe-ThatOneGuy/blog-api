const request = require('supertest');
const mongodb = require('../../config/mongoConfigTesting');
const express = require('express');
const app = express();
const ErrorHandler = require('../../middleware/ErrorHandler');

const _public = require('../../routes/public');

app.use(express.urlencoded({ extended: false }));
app.use('/', _public);
app.use(ErrorHandler);

describe('Test for the User controller', () => {
	beforeAll(async () => {
		await mongodb.initializeMongoServer();
	});

	afterAll(async () => {
		await mongodb.stopMongoServer();
	});

	test('Should create a new user', async () => {
		const response = await request(app)
			.post('/user/register')
			.type('form')
			.send({
				username: 'testuser',
				password: 'Password1',
				confirmPassword: 'Password1',
			});

		expect(response.status).toBe(200);
		expect(response.body.success).toBe(true);
		expect(response.body.user.username).toBe('testuser');
		expect(response.body.user).toHaveProperty('password');
		expect(response.body.user).toHaveProperty('isAdmin', false);
	});

	test('Should throw error if username && password is not sent with request', async () => {
		const response = await request(app)
			.post('/user/register')
			.type('form')
			.send({});

		expect(response.body).toHaveProperty('success', false);
		expect(response.body).toHaveProperty('message');
		expect(response.body.message[0]).toBe('USERNAME MUST NOT BE EMPTY');
		expect(response.body.message[1]).toBe(
			'PASSWORD MUST CONTAIN AT LEAST 8 CHARACTERS',
		);
	});

	test('Should throw error if username is already taken', async () => {
		const response = await request(app)
			.post('/user/register')
			.type('form')
			.send({
				username: 'testuser',
				password: 'Password1',
				confirmPassword: 'Password1',
			});

		expect(response.body).toHaveProperty('success', false);
		expect(response.body).toHaveProperty('message');
		expect(response.body.message[0]).toBe('USERNAME ALREADY TAKEN');
	});

	test('Should throw error if password does not validate', async () => {
		const response = await request(app)
			.post('/user/register')
			.type('form')
			.send({
				username: 'testuser1',
				password: 'Password',
				confirmPassword: 'Password',
			});

		expect(response.body).toHaveProperty('success', false);
		expect(response.body).toHaveProperty('message');
		expect(response.body.message[0]).toBe('PASSWORD MUST CONTAIN A NUMBER');
	});

	test('Should throw error if password does not validate', async () => {
		const response = await request(app)
			.post('/user/register')
			.type('form')
			.send({
				username: 'testuser1',
				password: 'Password1',
				confirmPassword: 'Password',
			});

		expect(response.body).toHaveProperty('success', false);
		expect(response.body).toHaveProperty('message');
		expect(response.body.message[0]).toBe('PASSWORDS MUST MATCH');
	});
});
