const dummy = (blogs) => 1

const totalLikes = (blogs) => {
    const reducer = (sum, item) => sum + item.likes
    return blogs.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let maxLieks = 0
    blogs.forEach(blog => maxLieks = Math.max(maxLieks, blog.likes))
    return blogs.find(blog => blog.likes === maxLieks)
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog
}