'use strict'

var noticiasController = require('../controllers/noticiasController')
var comentariosController = require('../controllers/comentariosController')
var mdAuth = require('../middelware/middelware')
var express = require('express')
var api = express.Router()

api.post('/agregarNoticia', mdAuth.ensureAuth, noticiasController.saveNoticiasAdmin)
api.put('/editarNoticia/:nId', mdAuth.ensureAuth, noticiasController.updateNoticiasAdmin)
api.delete('/eliminarNoticia/:nId', mdAuth.ensureAuth, noticiasController.deleteNoticiasAdmin)
api.get('/verTodasNoticias', mdAuth.ensureAuth, noticiasController.getNoticias)
api.get('/verNoticiaId/:nId', mdAuth.ensureAuth, noticiasController.getNoticiasId)

/*Rutas de comentarios*/
api.post('/agregarComentarioNoticia/:uId/:eId', mdAuth.ensureAuth, comentariosController.saveComentarioNoticia)
api.put('/editarComentarioNoticia/:uId/:eId/:cId', mdAuth.ensureAuth, comentariosController.updateComentarioNoticia)
api.delete('/eliminarComentarioNoticia/:cId', mdAuth.ensureAuth, comentariosController.deleleteComentarioNoticia)
api.get('/verTodosComentarios/:nId', mdAuth.ensureAuth, comentariosController.getComentariosNoticia)

module.exports = api