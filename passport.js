const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
let userModel = require('./user.js')
let postModel = require('./post.js')

passport.use(new LocalStrategy(authenticate))
passport.use('local-register', new LocalStrategy({
    passReqToCallback: true,
    usernameField: 'email',
    passwordField: 'password'
}, register))

function authenticate(email, password, done) {
    userModel.findOne({'email': email}, (err, user) => {
        if (err) return handleError(err)
        if (!user) {
            return done(null, false, {message: "User not found!"})
        }
        if (user.password !== password) {
            return done(null, false, {message: "Wrong password!"})
        }
        done(null, user)
    })
}

function register(req, email, password, done) {
    console.log(req, email, password)
    userModel.findOne({'email': email}, (err, user) => {
        if (password != req.body.password2) {
            console.log('Passwords dont match!')
            return done (null, false, {message: 'Passwords dont match!'})
        }
        const newUser = {
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            age: req.body.age,
            address: req.body.address,
            city: req.body.city,
            email: req.body.email,
            password: req.body.password,
            profileImg: req.body.profileImg,
            backImg: req.body.backImg,
            description: req.body.description,
            posts: [],
            follows: [''],
            favorite: []
        }
        userModel.create(newUser, (err) => {
            if (err) return handleError(err)
            userModel.findOne({'email': req.body.email}, (err, user) => {
                if (err) return handleError(err)
                done(null, user)
            })
        })
    })
}

passport.serializeUser((user, done) => {
    done(null, user._id)
})

passport.deserializeUser((id, done) => {
    userModel.findById(id, (err, user) => {
        if (err) handleError(err)
        done(null, user)
    })
})