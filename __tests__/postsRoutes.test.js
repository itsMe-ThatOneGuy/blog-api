require('dotenv').config();
const request = require('supertest');
const express = require('express');
const postRouter = express.Router();
const { postsPublic } = require('../routes/posts.js');
const models = require('../models/index.js');
const mongoose = require('mongoose');

const app = express();

app.use(express.urlencoded({ extended: false }));
app.use('/', postsPublic(postRouter));

describe('Test the posts endpoints', () => {
	/* beforeAll(async () => {k
        jest.settimeout
        await models.connectToDatabase();
    });

    afterAll(async () => {
        await mongoose.disconnect();
    }); */

	test('/posts should should responed', async () => {
		const respones = await request(app)
			.get('/posts')
			.expect('Content-Type', /json/)
			.expect(200);
		return console.log(respones);
	});
});
