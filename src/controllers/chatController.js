'use strict'

var Denuncia = require('../models/denuncias')
var User = require('../models/user')
var Chat = require('../models/chat')

function verChat(req, res) {
   var iduser = req.params.iduser
    
        Chat.findOne({ $or: [{ userId: iduser },{status: 'ACTIVO'}] }).exec ((err, userStored)=>{
            if(err) return res.status(400).send({mensaje: 'Error en la peticion'})
            if(userStored){
                return res.status(200).send(userStored)
            }else{
                Chat.findOne({ $or: [{ encargadoId: iduser },{status: 'ACTIVO'}] }).exec ((err, userStored2)=>{
                    if(err) return res.status(400).send({mensaje: 'Error en la peticion'})
                    if(userStored2){
                        return res.status(200).send(userStored2)
                    }else{
                        return res.status(500).send({ message: 'No se encontro chat para ti'})
                    }
            
                })
            }
        })
}

function sendMessage(req, res) {
    var params = req.body;
    var iduser = req.params.iduser

    Chat.findOne({ $or: [{ userId: iduser },{status: 'ACTIVO'}] }).exec ((err, userStored)=>{
        if(err) return res.status(400).send({mensaje: 'Error en la peticion'})
        if(userStored){
            Chat.findByIdAndUpdate(userStored._id, {
                $push: {
                    Messages: {
                        idUserMessage: iduser,
                        mensaje: params.mensaje
                    }
                }
            }, {new: true}, (err, mensajeAgregado)=>{
                if(err){
                    return res.status(500).send({ message: 'error en la peticion' + err})
                }else if(mensajeAgregado){
                    return res.send(mensajeAgregado)
                }else{
                    return res.status(500).send({ message:'no se pudo enviar el mensaje'})
                }
            })
        }else{
            Chat.findOne({ $or: [{ encargadoId: iduser },{status: 'ACTIVO'}] }).exec ((err, userStored2)=>{
                if(err) return res.status(400).send({mensaje: 'Error en la peticion'})
                if(userStored2){
                    Chat.findByIdAndUpdate(userStored2._id, {
                        $push: {
                            Messages: {
                                idUserMessage: iduser,
                                mensaje: params.mensaje
                            }
                        }
                    }, {new: true}, (err, mensajeAgregado)=>{
                        if(err){
                            return res.status(500).send({ message: 'error en la peticion' + err})
                        }else if(mensajeAgregado){
                            return res.send(mensajeAgregado)
                        }else{
                            return res.status(500).send({ message:'no se pudo enviar el mensaje'})
                        }
                    })
                }else{
                    return res.status(500).send({ message: 'No se encontro chat para ti'})
                }
        
            })
        }
    })
}

function endChat(req, res) {
    var idChat = req.params.idC;
    Chat.findByIdAndDelete(idChat, (err, chateliminado) => {
        if(err) return res.status(400).send({mensaje: 'Error en la peticion'})
        if(!chateliminado) return res.status(404).send({mensaje: 'No se pudo elimiar el chat'})
        return res.status(200).send(chateliminado)
    })
}


module.exports = {
    verChat,
    sendMessage,
    endChat
}