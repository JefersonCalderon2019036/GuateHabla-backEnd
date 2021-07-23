'use strict'

var noticiasController = require('../controllers/noticiasController')
var mdAuth = require('../middelware/middelware')
var express = require('express')
var api = express.Router()

api.post('/agregarNoticia', mdAuth.ensureAuth, noticiasController.saveNoticiasAdmin)
api.put('/editarNoticia/:nId', mdAuth.ensureAuth, noticiasController.updateNoticiasAdmin)
api.delete('/eliminarNoticia/:nId', mdAuth.ensureAuth, noticiasController.deleteNoticiasAdmin)
api.get('/verTodasNoticias', mdAuth.ensureAuth, noticiasController.getNoticias)
api.get('/verNoticiaId/:nId', mdAuth.ensureAuth, noticiasController.getNoticiasId)

module.exports = api