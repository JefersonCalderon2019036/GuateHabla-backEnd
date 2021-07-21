'use strict'

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')

//Importaciones de rutas
var User = require('./src/routs/userRoutes')

//Middlewares
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//cors
app.use(cors())

//rutas
app.use('/api', User)

module.exports = app