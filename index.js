const express = require('express')
const bodyParser = require('body-parser')
const port = 3500
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
    .use(express.static(__dirname + './views'))
/* GET AND POST REQUESTS */

    .get('/getAllUser', (req, res) => {
        let query = userModel.find({})
        query.select('first_name last_name')
        query.sort()
        query.exec((err, result) => {
            res.send(result)
        })
        /* userModel.findOne({}, ('first_name last_name'), (err, users) => {
            if (err) throw err
            res.send(users)
        }) */
        /* userModel
            .find()
            .where('first_name').equals('Tommaso')
            .where('age').gt(18).lt(50)
            .limit(5)
            .sort()
            .select('first_name last_name')
            .exec((err, data) => {
                if (err) throw err
                res.send(data)
            }) 
            findById()
            */
    })
    
    .listen(port || 8080)
