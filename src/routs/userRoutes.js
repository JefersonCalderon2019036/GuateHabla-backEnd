'use strict'

var userController = require('../controllers/userController')
var mdAuth = require('../middelware/middelware')
var express = require('express')
var api = express.Router()

api.post('/register', userController.registerUser)
api.post('/login', userController.login)
api.put('/userUpdate/:idU', mdAuth.ensureAuth, userController.updateUser)
api.delete('/userDelete/:idU', mdAuth.ensureAuth, userController.deleteUser)
api.get('/getUsers', mdAuth.ensureAuth,userController.getUsers)
api.get('/getUserId/:idU', mdAuth.ensureAuth, userController.getUserId)
api.get('/getUserIdAdmin/:idU', mdAuth.ensureAuth, userController.getUserIdAdmin)
api.put('/updateUserAdmin/:idU', mdAuth.ensureAuth, userController.updateUserAdmin)
api.delete('/deleteUserAdmin/:idU', mdAuth.ensureAuth, userController.deleteUserAdmin)
api.post('/saveUserAdmin', mdAuth.ensureAuth, userController.saveUserAdmin)

module.exports = api