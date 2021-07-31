'use strict'

var chatController = require('../controllers/chatController')
var mdAuth = require('../middelware/middelware')
var express = require('express')
var api = express.Router()

api.get('/verChat/:idC', mdAuth.ensureAuth, chatController.verChat);
api.post('/sendMessage/:idC', mdAuth.ensureAuth, chatController.sendMessage);
module.exports = api