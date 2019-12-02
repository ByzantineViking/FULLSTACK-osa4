const bcryptjs = require('bcryptjs')

const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request, response, next) => {
    try {
        const body = request.body
        if(body.username === undefined || body.password === undefined) {
            return response.status(400).send({error: "Both username and password must be defined"})
        }
        if(body.password.length < 3) {
            return response.status(400).send({ error: "Password must be at least 3 characters long"})
        }
        const saltRounds = 10
        const passwordHash = await bcryptjs.hash(body.password, saltRounds)


        const user = new User({
            username: body.username,
            name: body.name,
            passwordHash,
        })

        const savedUser = await user.save()

        response.json(savedUser)
    } catch (exception) {
        next(exception)
    }
})


usersRouter.get('/', async (request, response) => {
    const users = await User
        .find({})
        .populate('blogs', {url: 1, title: 1, author: 1, id: 1})

    response.json(users.map(user => user.toJSON()))

})


usersRouter.get('/:id', async (request, response, next) => {
    try {
        const target = await User.findById(request.params.id)
        if (target) {
            response.json(target.toJSON())
        } else {
            response.status(404).end()
        }
    } catch (exception) {
        next(exception)
    }
})

module.exports = usersRouter