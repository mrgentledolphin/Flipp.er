const express = require('express')
const bodyParser = require('body-parser')
const port = 3500
/* MONGODB */
const MongoClient = require('mongodb').MongoClient
const assert = require('assert')
const url = 'mongodb://gd:gd@ds231460.mlab.com:31460/flipper'



console.log('Server started on port: ' + (port || 8080)) 

express()
/* MIDDLEWARE */
    .use(bodyParser.urlencoded({extended: false}))
    .use(bodyParser.json())
    .set('view engine', 'hjs')
    .use(express.static(__dirname + './views'))
/* GET AND POST REQUESTS */
    .get('/', (req, res) => {
        res.send('home page')
    })

    .listen(port || 8080)
