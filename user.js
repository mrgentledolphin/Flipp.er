const mongoose = require('mongoose')
let Schema = mongoose.Schema
let usersSchema = new Schema({
    first_name: String,
    last_name: String,
    age: Number,
    address: String,
    city: String,
    email: String,
    password: String,
    posts: [String],
    follows: [String],
    favorite: [String],
    profileImg: String,
    backImg: String,
    description: String
})
module.exports = mongoose.model('users', usersSchema)