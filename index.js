const express = require('express')
const bodyParser = require('body-parser')
const port = 3500
const path = require('path')
/* MONGODB */
const mongoose = require('mongoose')
const url = 'mongodb://gd:gd@ds231460.mlab.com:31460/flipper'
mongoose.connect(url)
let db = mongoose.connection
db.on('error', console.error.bind(console, 'MongoDB connection error:'))

let userModel = require('./user.js')
let postModel = require('./post.js')

console.log('Server started on port: ' + (port || 8080)) 

express()
/* MIDDLEWARE */
    .use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json())
    .set('view engine', 'hjs')
    .use(express.static(__dirname + '/views/'))
/* GET AND POST REQUESTS */
    .get('/', (req, res) => {
        userModel.findOne({}, (err, user) => {
            if (err) return handleError(err)
            let { _id } = user
            let finalPosts = []
            let posts = []
            postModel.find({}, (err, postRaw) => {
                if (err) return handleError(err)
                for (let i = 0; i < postRaw.length; i++) {
                    if ( postRaw[i].userId == _id || user.follows.contains(postRaw[i].userId) ) {
                        finalPosts.push(postRaw[i])
                    }
                }
                finalPosts.reverse()
                for (let i = 0; i < finalPosts.length; i++) {
                    for (let j = 0; j < user.favorite.length; j++) {
                        if (finalPosts[i]._id == user.favorite[j]) {
                            finalPosts[i].class = 'favorite'
                            finalPosts[i].cuore = 'Cuore'
                        } else {
                            finalPosts[i].class = 'favorite_border'
                            finalPosts[i].cuore = 'noCuore'
                        }
                    }
                }
                res.render('index', {
                    user,
                    posts: finalPosts
                })
            })
        })
    })
    .get('/profile', (req, res) => {
        let id = '5b03f4fedefd6a00482dc82d'
        
        userModel.findById(id, (err, user) => {
            let { _id } = user
            let finalPosts = []
            let posts = []
            postModel.find({}, (err, postRaw) => {
                if (err) return handleError(err)
                for (let i = 0; i < postRaw.length; i++) {
                    if ( postRaw[i].userId == _id || user.follows.contains(postRaw[i].userId) ) {
                        finalPosts.push(postRaw[i])
                    }
                }
                finalPosts.reverse()
                for (let i = 0; i < finalPosts.length; i++) {
                    for (let j = 0; j < user.favorite.length; j++) {
                        if (finalPosts[i]._id == user.favorite[j]) {
                            finalPosts[i].class = 'favorite'
                            finalPosts[i].cuore = 'Cuore'
                        } else {
                            finalPosts[i].class = 'favorite_border'
                            finalPosts[i].cuore = 'noCuore'
                        }
                    }
                }
                res.render('profile', {
                    user,
                    posts: finalPosts
                })
            })
        })
    })
    .get('/profile/:userId', (req, res) => {
        let id = req.params.userId

        userModel.findById(id, (err, user) => {
            let { _id } = user
            let finalPosts = []
            let posts = []
            postModel.find({}, (err, postRaw) => {
                if (err) return handleError(err)
                for (let i = 0; i < postRaw.length; i++) {
                    if (postRaw[i].userId == _id) {
                        finalPosts.push(postRaw[i])
                    }
                }
                finalPosts.reverse()
                for (let i = 0; i < finalPosts.length; i++) {
                    for (let j = 0; j < user.favorite.length; j++) {
                        if (finalPosts[i]._id == user.favorite[j]) {
                            finalPosts[i].class = 'favorite'
                            finalPosts[i].cuore = 'Cuore'
                        } else {
                            finalPosts[i].class = 'favorite_border'
                            finalPosts[i].cuore = 'noCuore'
                        }
                    }
                }
                res.render('profileExt', {
                    user,
                    posts: finalPosts
                })
            })
        })
    })
    .post('/post', (req, res) => {
        let post = {
            title: req.body.title,
            text: req.body.text,
            url: req.body.url,
            userId: '5b03f4fedefd6a00482dc82d',
            publisher: 'Tommaso Iovane'
        }
        postModel.create(post, (err) => {
            if (err) return handleError(err)
            res.render('ok')
        })
    })
    .post('/addFav', (req, res) => {
        let postId = req.body.postId
        userModel.findOne({}, (err, user) => {
            if (err) return handleError(err)
            postModel.findOne({'_id': postId}, (err, post) => {
                user.favorite.push(post._id)
                user.save((err, updatedUser) => {
                    res.send('added!')
                })
            })
        })
    })
    .post('/remFav', (req, res) => {
        let postId = req.body.postId
        userModel.findOne({}, (err, user) => {
            if (err) return handleError(err)
            for (let i = 0; i < user.favorite.length; i++) {
                if (user.favorite[i] == postId) {
                    user.favorite.splice(i, 1)
                }
            }
            user.save((err, updatedUser) => {
                res.send('removed!')
            })
        })
    })
    .get('/ok', (req, res) => {
        res.render('ok')
    })
    
    .listen(port || 8080)
