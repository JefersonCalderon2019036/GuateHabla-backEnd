'use strict'

var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var cors = require('cors')

//Importaciones de rutas
var User = require('./src/routs/userRoutes')
var Noticias = require('./src/routs/noticiasRouts')
var Denuncias = require('./src/routs/denunciasRoutes')
var Chat = require('./src/routs/chatRoutes')

//Middlewares
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())

//cors
app.use(cors())

//rutas
app.use('/api', User, Noticias, Denuncias, Chat)

module.exports = app
