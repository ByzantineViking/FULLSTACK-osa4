const express = require('express')
const app = express()

const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')

const config = require('./utils/config')
const middleware = require('./utils/middleware')

// Routing
const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')


const logger = require('./utils/logger')



logger.info('connecting to', config.MONGODB_URI)
mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false})
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.info('error connection to MongoDB:', error.message)
    })


app.use(cors())
app.use(bodyParser.json())

app.use(express.static('build'))
app.use(middleware.requestLogger)



app.use('/api/users', usersRouter)
app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)


app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)



module.exports = app


