'use strict'

var Denuncia = require('../models/denuncias')
var User = require('../models/user')
var Chat = require('../models/chat')

function addDenuncia(req, res) {
    var denuncia = new Denuncia();
    var chat = new Chat();
    var params = req.body;
    var userId = req.params.idU;

    if (params.descripcion && params.tipoDenuncia) {

        User.findOne({ rol: 'ROL_POLI', estado: 'DISPONIBLE' }, { estado: 1, name: 1 }).exec((err, poliFound) => {
            if(userId == poliFound._id) {
                return res.status(500).send({message: 'Un policia no puede asignar su propia denuncia'})
            }
            if (err) {
                return res.status(500).send({ message: 'Error en la peticion' + err })
            } else if (poliFound) {
                denuncia.userId = userId
                denuncia.encargadoId = poliFound._id;
                denuncia.descripcion = params.descripcion;
                denuncia.nameEncargado = poliFound.name;
                denuncia.tipoDenuncia = params.tipoDenuncia;
                denuncia.status = 'En revision';
                denuncia.img = params.img;
                denuncia.save((err, denunciaSave) => {
                    if (err) {
                        return res.status(500).send({ message: 'error en la peticion' + err })
                    } else if (denunciaSave) {
                        User.findByIdAndUpdate({ _id: userId }, { estado: 'Denuncia en Seguimiento' }, { new: true }, (err, userState) => {
                        })
                        User.findByIdAndUpdate({ _id: poliFound._id }, { estado: 'OCUPADO' }, { new: true }, (err, poliState) => {
                        })
                        User.findById({ _id: userId }, (err, userFound) => {
                            chat.userId = userId;
                            chat.username = userFound.name;
                            chat.encargadoId = poliFound._id;
                            chat.nameEncargado = poliFound.name;
                            chat.status = 'ACTIVO';
                            chat.save((err,chatCreado) => {
                                if (err) {
                                    return res.status(500).send({ message: 'error en la peticion' + err})
                                }else if (chatCreado){
                                    return res.send(denunciaSave)
                                }else{
                                    return res.status(500).send({ message: 'no se pudo crear el chat'})
                                }
                            })
                        })
                    } else {
                        return res.status(500).send({ message: 'no se pudo guardar la denuncia' })
                    }
                })
            } else {
                return res.status(500).send({ message: 'No hay policias disponibles' })
            }
        })
    } else {
        return res.status(500).send({ message: 'por favor ingrese una descripcion y el tipo' })
    }
}

function listDenuncias(req, res){
    if(req.user.rol != "ROL_ADMIN") {
        return res.status(500).send({ mensaje: "Solo el Administrador puede listar todas las denuncias"})
    }
    Denuncia.find((err, denunciasFound) => {
        if(err) {
            return res.status(500).send({ message: 'error en la peticion'})
        } else if(denunciasFound){
            return res.send(denunciasFound)
        }else{
            return res.status(500).send({ message:'no se encontraron denuncias'})
        }
    })
}

function listDenunciasUser(req, res){
    var userId = req.params.idU;

    if(userId != req.user.sub) {
        return res.status(500).send({ mensaje: "No puedes ver las denuncias este usuario"})
    }
    Denuncia.find({userId: userId},(err, denunciasFound) => {
        if(err) {
            return res.status(500).send({ message: 'error en la peticion'})
        } else if(denunciasFound){
            return res.send(denunciasFound)
        }else{
            return res.status(500).send({ message:'no se encontraron denuncias'})
        }
    })
}

function listDenunciasPoli(req, res){
    var encargadoId = req.params.idP;

    if(encargadoId != req.user.sub) {
        return res.status(500).send({ mensaje: "No puedes ver las denuncias que atendio este policia"})
    }
    Denuncia.find({encargadoId: encargadoId},(err, denunciasFound) => {
        if(err) {
            return res.status(500).send({ message: 'error en la peticion'})
        } else if(denunciasFound){
            return res.send(denunciasFound)
        }else{
            return res.status(500).send({ message:'no se encontraron denuncias'})
        }
    })
}

function listDenunciasActivas(req, res) {
    if(req.user.rol != "ROL_POLI") {
        return res.status(500).send({ mensaje: "Solo el policia puede listar las denuncias activas"})
    }
    Denuncia.find({status: 'En revision'},(err, denunciasFound) => {
        if(err) {
            return res.status(500).send({ message: 'error en la peticion'})
        } else if(denunciasFound){
            return res.send(denunciasFound)
        }else{
            return res.status(500).send({ message:'no se encontraron denuncias'})
        }
    })
}

function editDenuncia(req, res) {
    var idDenuncia = req.params.idD
    var update = req.body
    Denuncia.find({_id: idDenuncia},(err, denunciaFound) => {
        if(err) {
            return res.status(500).send({ message: 'error en la peticion'})
        } else if(denunciaFound){
            //return res.send(denunciaFound)
            if((denunciaFound.userId === req.user.sub) || (denunciaFound.encargadoId === req.user.sub)){
                return res.status(500).send({ message: 'no tienes permiso para editar esta denuncia'})
            }
            Denuncia.findByIdAndUpdate(idDenuncia, update, {new: true}, (err, denunciaUpdated) => {
                if(err) {
                    return res.status(500).send({ message: 'error en la peticion' + err})
                }else if(denunciaUpdated){
                    return res.send(denunciaUpdated)
                }else{
                    return res.status(500).send({ message:'no se actualizo la denuncia'})
                }
            })
        }else{
            return res.status(500).send({ message:'no se encontro la denuncia'})
        }
    })
}

module.exports = {
    addDenuncia,
    listDenuncias,
    listDenunciasUser,
    listDenunciasPoli,
    listDenunciasActivas,
    editDenuncia
}