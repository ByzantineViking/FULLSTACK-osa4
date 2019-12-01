const mongoose = require('mongoose')
const supertest = require('supertest')

const app = require('../app')
const Blog = require('../models/blog')
const helper = require('../utils/test_resources')

const api = supertest(app)

beforeEach( async () => {
    // Database is cleared
    await Blog.deleteMany({})
    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('blogs are returned as json', async () => {
    await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('all notes are returned', async () => {
    const response = await api.get('/api/blogs')

    expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('a specific note is withing the returned notes', async () => {
    const response = await api.get('/api/blogs')

    const contents = response.body.map(r => r.title)

    expect(contents).toContain(
        'TOP 10 REASONS WHY TRUMP IS BADDEST'
    )
})

test('there is _id field defined', async () => {
    const response = await api.get('/api/blogs')
    response.body.map(r => expect(r["id"]).toBeDefined())
})
test('post works', async () => {
    const previously = await api.get('/api/blogs')
    const prev = previously.body.length

    const newBlog = {
        title: "102 Ways to get fit",
        url: "myblog.ru",
        author: "mom",
        likes: "3"
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
    const final = await api.get('/api/blogs')
    expect(final.body.length).toBe(prev + 1)
})

test('model defaults missing \'likes\' property as 0', async() => {
    const newBlog = {
        title: "102 Ways to get fit",
        url: "myblog.ru",
        author: "mom",
    }
    const ret = await api
        .post('/api/blogs')
        .send(newBlog)
    expect(ret.body.likes).toBe(0)
})

test('model detects missing \'likes\', and returns 400 Bad Request', async () => {
    const newBlog = {
        author: "mom",
        likes: 12
    }
    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

})


afterAll(() => {
    mongoose.connection.close()
})