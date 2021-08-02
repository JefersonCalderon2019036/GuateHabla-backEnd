'use strict'

var chatController = require('../controllers/chatController')
var mdAuth = require('../middelware/middelware')
var express = require('express')
var api = express.Router()

api.get('/verChat/:iduser', mdAuth.ensureAuth, chatController.verChat);
api.post('/sendMessage/:iduser', mdAuth.ensureAuth, chatController.sendMessage);
api.delete('/endChat/:idC', mdAuth.ensureAuth, chatController.endChat);
module.exports = api