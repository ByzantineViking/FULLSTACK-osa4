/* eslint-disable no-undef */
const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        // Cuts the "bearer " from the Authentication Header, left only token
        return authorization.substring(7)
    }
    return null
}


blogsRouter.get('/', async (request, response) => {
    const newBlog = await Blog
        .find({})
        .populate('userId', { username: 1, name: 1, id: 1 })

    response.json(newBlog.map(blog => blog.toJSON()))

})

blogsRouter.get('/:id',  async (request, response, next) => {
    try {
        const target = await Blog.findById(request.params.id)
        if (target) {
            response.json(target.toJSON())
        } else {
            response.status(404).end()
        }
    } catch(exception) {
        next(exception)
    }
})

blogsRouter.post('/', async (request, response, next) => {
    try {
        const body = new Blog(request.body)
        const token = getTokenFrom(request)

        const decodedToken = jwt.verify(token, process.env.SECRET)
        if (!token || !decodedToken.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const user = await User.findById(body.userId)
        const blog = new Blog({
            title: body.title,
            author: body.author,
            url: body.url,
            likes: body.likes,
            userId: user.id,
        })
        const result = await blog.save()
        user.blogs = user.blogs.concat(result._id)
        await user.save()
        response.status(201).json(result)
    } catch(exception) {
        next(exception)
    }
    
    
})

blogsRouter.delete('/:id',  async (request, response, next) => {
    try {
        const token = getTokenFrom(request)
        const user = jwt.verify(token, process.env.SECRET)
        if (!token || !user.id) {
            return response.status(401).json({ error: 'token missing or invalid' })
        }

        const blog = await Blog.findById(request.params.id)
        if(!blog) {
            return response.status(404).json({ error: 'Already deleted, or otherwise not found'})
        }
        if (blog.userId.toString() === user.id.toString()) {
            await Blog.findByIdAndRemove(request.params.id)
            return response.status(401).end()
        }
        
    } catch(exception) {
        next(exception)
    }
})

blogsRouter.put('/:id', async(request, response, next) => {
    const body = request.body

    const blog = {
        title: body.title,
        author: body.author,
        url: body.url,
        likes: body.likes
    }

    try {
        const updatedBlog = await Blog.findByIdAndUpdate(request.params.id, blog, { new: true })
        response.json(updatedBlog.toJSON())
    } catch(exception) {
        next(exception)
    }
})



module.exports = blogsRouter