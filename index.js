const express = require('express')
const session = require('express-session')
const passport = require('passport')
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
require('./passport')

console.log('Server started on port: ' + (port || 8080)) 

express()
/* MIDDLEWARE */
    .use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json())
    .set('view engine', 'hjs')
    .use(express.static(__dirname + '/views/'))
    .use(session({secret: 'flipper', saveUninitialized: false, resave: false}))
    .use(passport.initialize())
    .use(passport.session())
/* GET AND POST REQUESTS */
    .get('/', (req, res) => {
        if(req.isAuthenticated()) {
            userModel.findOne({'_id': req.session.passport.user}, (err, user) => {
                req.session.user = user
                if (err) return handleError(err)
                let { _id } = user
                let finalPosts = []
                let posts = []
                postModel.find({}, (err, postRaw) => {
                    if (err) return handleError(err)
                    for (let i = 0; i < postRaw.length; i++) {
                        if (postRaw[i].userId == _id || user.follows.includes(postRaw[i].userId)) {
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
        } else {
            res.redirect('/login')
        }
        
    })
    .get('/profile', (req, res) => {
        if (!req.isAuthenticated()) {
            res.redirect('/login')
        }
        let id = req.session.passport.user
        
        userModel.findById(id, (err, user) => {
            let { _id } = user
            let finalPosts = []
            let posts = []
            postModel.find({}, (err, postRaw) => {
                if (err) return handleError(err)
                for (let i = 0; i < postRaw.length; i++) {
                    if ( postRaw[i].userId == _id) {
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
        if (!req.isAuthenticated()) {
            res.redirect('/login')
        }
        let id = req.params.userId

        userModel.findById(id, (err, user) => {
            let { _id } = user
            let finalPosts = []
            let posts = []
            let isFollowed = {
                color: 'blue',
                icon: 'thumb_up',
                text: 'Follow'
            }
            userModel.findById(req.session.passport.user, (err, userSession) => {
                let { follows } = userSession
                for (let i = 0; i < follows.length; i++) {
                    if (follows[i] == String(_id)) {
                        isFollowed.color = 'red'
                        isFollowed.icon = 'thumb_down'
                        isFollowed.text = 'Unfollow'
                    }
                }
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
                        posts: finalPosts,
                        isFollowed
                    })
                })
            })
            
        })
    })
    .get('/editProfile/:userId', (req, res) => {
        if (!req.isAuthenticated()) {
            res.redirect('/login')
        }
        let userId = req.session.passport.user
        userModel.findById(userId, (err, user) => {
            if (err) return handleError(err)
            res.render('editProfile', {
                user
            })
        })
    })
    .get('/favorite', (req, res) => {
        if (!req.isAuthenticated()) {
            res.redirect('/login')
        }
        let id = req.session.passport.user
        userModel.findById(id, (err, user) => {
            if(err) return handleError(err)
            let { favorite } = user
            postModel.find({}, (err, posts) => {
                if (err) return handleError(err)
                let postList = []
                for (let i = 0; i < posts.length; i++) {
                    for (let j = 0; j < favorite.length; j++) {
                        if (String(posts[i]._id) == favorite[j]) {
                            postList.push(posts[i])
                        }
                    }
                }
                posts.reverse()
                res.render('favorite', {
                    posts: postList,
                    user
                })
            })
        })
    })
    .get('/search', (req, res) => {
        if (!req.isAuthenticated()) {
            res.redirect('/login')
        }
        let id = req.session.passport.user
        userModel.findById(id, (err, user) => {
            if(err) return handleError(err)
            res.render('search',{
                user
            })
        })
    })
    .get('/login', (req, res) => {
        res.render('login')
    })
    .get('/signup', (req, res) => {
        res.render('signup')
    })
    .get('/follows', (req, res) => {
        if (!req.isAuthenticated()) {
            res.redirect('/login')
        }
        let id = req.session.passport.user
        userModel.findById(id, (err, user) => {
            let { follows } = user
            userModel.find({}, (err, allUser) => {
                let followed = []
                let followedId = []
                for (let i = 0; i < allUser.length; i++) {
                    for (let j = 0; j < follows.length; j++) {
                        if (follows[j] == String(allUser[i]._id) && String(allUser[i]._id) != id && !followedId.includes(follows[j])) {
                            console.log(follows[j], allUser[i]._id)
                            followed.push(allUser[i])
                            followedId.push(String(allUser[i]._id))
                        }
                    }
                }
                res.render('follows', {
                    user: followed
                })
            })
        })

    })
    .post('/login', passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/login"
    }))
    .post('/signup', passport.authenticate('local-register', {
        successRedirect: "/",
        failureRedirect: "/signup"
    }))
    .get('/logout', (req, res, next) => {
        req.session.destroy((err) => {
            res.redirect("/")
        })
    })
    .post('/post', (req, res) => {
        let post = {
            title: req.body.title,
            text: req.body.text,
            url: req.body.url,
            userId: req.session.passport.user,
            publisher: req.session.user.first_name + ' ' + req.session.user.last_name
        }
        postModel.create(post, (err) => {
            if (err) return handleError(err)
            res.render('ok')
        })
    })
    .post('/addFav', (req, res) => {
        let { postId } = req.body
        userModel.findOne({'_id': req.session.passport.user}, (err, user) => {
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
        userModel.findOne({'_id': req.session.passport.user}, (err, user) => {
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
    .post('/addFollow', (req, res) => {
        let { userId } = req.body
        userModel.findOne({'_id': req.session.passport.user}, (err, user) => {
            if (err) return handleError(err)
            user.follows.push(userId)
            user.save((err, updatedUser) => {
                res.send('followed!')
            })
        })
    })
    .post('/remFollow', (req, res) => {
        let { userId } = req.body
        userModel.findOne({'_id': req.session.passport.user}, (err, user) => {
            if (err) return handleError(err)
            for (let i = 0; i < user.follows.length; i++) {
                if (user.follows[i] == userId) {
                    user.follows.splice(i, 1)
                }
            }
            user.save((err, updatedUser) => {
                res.send('unfollowed!')
            })
        })
    })
    .post('/editProfile/:userId', (req, res) => {
        if (req.isAuthenticated()) {
            let { userId } = req.params
            let newUser = req.body
            if (newUser.password === newUser.passwordConfirm) {
                userModel.findById(userId, (err, user) => {
                    if (err) return handleError(err)
                    user.age = newUser.age
                    user.address = newUser.address
                    user.city = newUser.city
                    user.email = newUser.email
                    user.backImg = newUser.backImg
                    user.profileImg = newUser.profileImg
                    user.description = newUser.description
                    user.password = newUser.password
                    user.save((err, updatedUser) => {
                        res.render('ok')
                    })
                })
            } else {
                res.send('error, password didnt match!')
            }
        }
    })
    .post('/searchPerson', (req, res) => {
        if (!req.isAuthenticated()) {
            res.redirect('/login')
        }
        let { query } = req.body
        userModel.find({'email': query}, (err, user) => {
            res.render('searchResult', {
                user
            })
        })
    })

    .get('/session', (req, res) => {
        res.send(req.session)
    })

    .listen(port || 8080)

