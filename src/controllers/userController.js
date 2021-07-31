'use strict'

var User = require('../models/user')
var bcrypt = require('bcrypt-nodejs')
var jwt = require('../services/jwt')
const { response } = require('express')
const { findById } = require('../models/user')

function registerUser(req, res){
    var userModel = new User()
    var params = req.body;

    if(params.user && params.email && params.password && params.dpi){

        userModel.name = params.name
        userModel.user = params.user
        userModel.email = params.email
        userModel.rol = 'ROL_USUARIO'
        userModel.img = 'https://th.bing.com/th/id/R.b5191f32201ffaa11c934ef5e8336aa6?rik=oHQqwkVkiV8jsg&riu=http%3a%2f%2fwww.coordinadora.com%2fwp-content%2fuploads%2fsidebar_usuario-corporativo.png&ehk=1xJb2We0RTYHhqlCyflIts8iyhfaNrSLijnToqgjtQg%3d&risl=&pid=ImgRaw'
        userModel.estado =  params.estado
        userModel.telefono = params.telefono
        userModel.direccion = params.direccion
        userModel.dpi = params.dpi

        User.find({
            $or:[
                { user: userModel.user },
                { email: userModel.email }
            ]
        }).exec((err, userStored)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'  + err})
            if(userStored && userStored.length >= 1){
                return res.status(400).send({mensaje: 'El usuario o email que intentas ingresar ya existe'})
            }else{
                bcrypt.hash(params.password, null, null, (err, bcryptPassword)=>{
                    userModel.password = bcryptPassword
                
                    userModel.save((err, userSave)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion'  + err})
                        if(userSave){
                            return res.status(200).send({userSave})
                        }else{
                            return rs.status(400).send({mensaje: 'Error al guardar el usuario'})
                        }
                    })
                })
            }
        })

    }else{
        return res.status(404).send({mensaje: 'Debes llenar todos los campos necesarios'})
    }
}

function login(req, res){
    var params = req.body;

    if (params.email && params.password) {
        User.findOne({ email: params.email.toLowerCase() }, (err, userFind) => {
            if (err) {
                return res.status(500).send({ message: 'Error general'  + err});
            } else if (userFind) {
                bcrypt.compare(params.password, userFind.password, (err, checkPassword) => {
                    if (err) {
                        return res.status(500).send({ message: 'Error general en la verificación de la contraseña' + err });
                    } else if (checkPassword) {
                        if (params.gettoken) {
                            delete userFind.password
                            return res.send({ token: jwt.createToken(userFind), user: userFind });
                        } else {
                            return res.send({ token: jwt.createToken(userFind), user: userFind });
                        }
                    } else {
                        return res.status(401).send({ message: 'Contraseña incorrecta' });
                    }
                })
            } else {
                return res.send({ message: 'Email incorrecto' });
            }
        })
    } else {
        return res.status(401).send({ message: 'Por favor ingresa los datos obligatorios' });
    }
}

function updateUser(req, res){
    var userId = req.params.idU
    var update = req.body

    delete update.password

    if(userId != req.user.sub){
        return res.status(500).send({mensaje: 'No tienes permisos para editar este usuario'})
    }

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdate)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'  + err})
        if(!userUpdate) return res.status(404).send({mensaje: 'No se ha podido actualizar el usuario'})

        return res.status(200).send(userUpdate)
    })

}

function deleteUser(req, res){
    var userId = req.params.idU

    if(userId != req.user.sub){
        return res.status(500).send({mensaje: 'No tienes permiso para eleminar a este usuario'})
    }

    User.findByIdAndDelete(userId, (err, userDelete)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'  + err})
        if(!userDelete) return res.status(400).send({mensaje: 'No se pudo eliminar el usuario'})

        return res.status(200).send({mensaje: 'Se elimino correctamente el usuario con el id: '+userId})
    })
}

function getUsers(req, res){
    if (req.user.rol != "ROL_ADMIN") {
        return res.status(500).send({ mensaje: "Solo el Administrador puede ver todos los usuarios" })
    }
    User.find((err, userStored)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion' + err})
        if(!userStored) return res.status(500).send({mensaje: 'Error al obtener los usuarios'})
        if(userStored <= 0){
            return res.status(200).send({mensaje: 'No hay ningun usuario'})
        }else{
            return res.status(200).send(userStored)
        }
    })
}

function getUserId(req, res){
    var userId = req.params.idU

    User.findOne({ $or: [{ _id: userId }] }).exec ((err, userStored)=>{
        if(err) return res.status(400).send({mensaje: 'Error en la peticion'  + err})
        if(!userStored) return res.status(404).send({mensaje: 'Error al obtener los datos del usuario'})

        return res.status(200).send(userStored)
    })
}

function getUserIdAdmin(req, res){
    var userId = req.params.idU
    
    if (req.user.rol != "ROL_ADMIN") {
        return res.status(500).send({ mensaje: "Solo el Administrador puede ver a otro usuario" })
    }

    User.find().exec ((err, userStored)=>{
        if(err) return res.status(400).send({mensaje: 'Error en la peticion'  + err})
        if(!userStored) return res.status(404).send({mensaje: 'Error al obtener los datos del usuario'})

        return res.status(200).send(userStored)
    })
}

function updateUserAdmin(req, res){

    if (req.user.rol != "ROL_ADMIN") {
        return res.status(500).send({ mensaje: "Solo el Administrador puede editar otros usuarios" })
    }

    var userId = req.params.idU
    var update = req.body

    delete update.password
    console.log(update);

    User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdate)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'  + err})
        if(!userUpdate) return res.status(404).send({mensaje: 'No se ha podido actualizar el usuario'})

        return res.status(200).send(userUpdate)
    })

}

function deleteUserAdmin(req, res){
    var userId = req.params.idU

    if (req.user.rol != "ROL_ADMIN") {
        return res.status(500).send({ mensaje: "Solo el Administrador puede eliminar otros usuarios" })
    }

    User.findByIdAndDelete(userId, (err, userDelete)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'  + err})
        if(!userDelete) return res.status(400).send({mensaje: 'No se pudo eliminar el usuario'})

        return res.status(200).send({mensaje: 'Se elimino correctamente el usuario con el id: '+userId})
    })
}

function saveUserAdmin(req, res){
    var userModel = new User()
    var params = req.body

    if (req.user.rol != "ROL_ADMIN") {
        return res.status(500).send({ mensaje: "Solo el Administrador puede agregar usuarios" })
    }

    if(params.user && params.email && params.password && params.dpi){

        userModel.name = params.name
        userModel.user = params.user
        userModel.email = params.email
        userModel.rol = 'ROL_USUARIO'
        userModel.img = 'https://th.bing.com/th/id/R.b5191f32201ffaa11c934ef5e8336aa6?rik=oHQqwkVkiV8jsg&riu=http%3a%2f%2fwww.coordinadora.com%2fwp-content%2fuploads%2fsidebar_usuario-corporativo.png&ehk=1xJb2We0RTYHhqlCyflIts8iyhfaNrSLijnToqgjtQg%3d&risl=&pid=ImgRaw'
        userModel.estado =  params.estado
        userModel.telefono = params.telefono
        userModel.direccion = params.direccion
        userModel.dpi = params.dpi

        User.find({
            $or:[
                { user: userModel.user },
                { email: userModel.email }
            ]
        }).exec((err, userStored)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion' + err})
            if(userStored && userStored.length >= 1){
                return res.status(400).send({mensaje: 'El usuario o email que intentas ingresar ya existe'})
            }else{
                bcrypt.hash(params.password, null, null, (err, bcryptPassword)=>{
                    userModel.password = bcryptPassword
                
                    userModel.save((err, userSave)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion' + err})
                        if(userSave){
                            return res.status(200).send({userSave})
                        }else{
                            return rs.status(400).send({mensaje: 'Error al guardar el usuario'})
                        }
                    })
                })
            }
        })

    }else{
        return res.status(404).send({mensaje: 'Debes llenar todos los campos necesarios'})
    }
}

module.exports = {
    registerUser,
    login,
    updateUser,
    deleteUser,
    getUsers,
    getUserId,
    getUserIdAdmin,
    updateUserAdmin,
    deleteUserAdmin,
    saveUserAdmin
}
