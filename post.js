const mongoose = require('mongoose')
let Schema = mongoose.Schema

let postsScheme = new Schema({
    title: String,
    text: String,
    url: String,
    userId: String,
    publisher: String
})

module.exports = mongoose.model('posts', postsScheme)