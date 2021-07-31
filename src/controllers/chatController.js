'use strict'

var Denuncia = require('../models/denuncias')
var User = require('../models/user')
var Chat = require('../models/chat')

function verChat(req, res) {
   var idChat = req.params.idC
    
    Chat.findById({ _id: idChat}, (err, chatFound) => {
        if(err){
            return res.status(500).send({ message: 'error en la peticion'})
        }else if(chatFound){
            if((chatFound.userId === req.user.sub) || (chatFound.encargadoId === req.user.sub)){
                return res.status(500).send({ message: 'no tienes permiso para ver este chat'})
            }
            return res.send(chatFound)
        }else{
            return res.status(500).send({ message:'no se encontro el chat'})
        }
    })
}

function sendMessage(req, res) {
    var params = req.body;
    var idChat = req.params.idC;
    var userId = req.user.sub;

    Chat.findByIdAndUpdate(idChat, {
        $push: {
            Messages: {
                idUserMessage: userId,
                mensaje: params.mensaje
            }
        }
    }, {new: true}, (err, mensajeAgregado)=>{
        if(err){
            return res.status(500).send({ message: 'error en la peticion'})
        }else if(mensajeAgregado){
            return res.send(mensajeAgregado)
        }else{
            return res.status(500).send({ message:'no se pudo enviar el mensaje'})
        }
    })
}

module.exports = {
    verChat,
    sendMessage
}