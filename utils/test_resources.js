const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: "TOP 10 REASONS WHY TRUMP IS BADDEST",
        author: "Linda Liberal",
        url: "www.votedemocrat2020.com",
        likes: 2,
    },
    {
        title: "watch liberal c***s get SERVED by FACTS AND LOGIC",
        author: "Intellectual2003",
        url: "www.election.info.com.ru",
        likes: 21000,
    },
]

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}






module.exports = {
    initialBlogs,
    usersInDb,
}