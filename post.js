const mongoose = require('mongoose')
let Schema = mongoose.Schema

let postsScheme = new Schema({
    title: String,
    text: String,
    hasImg: Boolean,
    hasVid: Boolean,
    url: String
})

module.exports = mongoose.model('posts', postsScheme)