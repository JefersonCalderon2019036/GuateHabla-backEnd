'use strict'

var denunciaController = require('../controllers/denunciaController')
var mdAuth = require('../middelware/middelware')
var express = require('express')
var api = express.Router()

api.put('/addDenuncia/:idU',mdAuth.ensureAuth, denunciaController.addDenuncia);
api.get('/listDenuncias',mdAuth.ensureAuth, denunciaController.listDenuncias);
api.get('/listDenunciasUser/:idU',mdAuth.ensureAuth, denunciaController.listDenunciasUser);
api.get('/listDenunciasPoli/:idP',mdAuth.ensureAuth, denunciaController.listDenunciasPoli);
api.get('/listDenunciasActivas',mdAuth.ensureAuth, denunciaController.listDenunciasActivas);
api.get('/OneDenuncia/:idD',mdAuth.ensureAuth, denunciaController.OneDenuncia);
api.put('/editDenuncia/:idD',mdAuth.ensureAuth, denunciaController.editDenuncia);
module.exports = api