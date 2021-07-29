'use strict'

var Noticias = require('../models/noticias')

function saveComentarioNoticia(req, res){
    var params = req.body
    var encuestaId = req.params.eId
    var userId = req.params.uId

    Noticias.findByIdAndUpdate(encuestaId, {
        $push: {
            comentarios: {
                userIdComentario: userId,
                username: params.username,
                descripcionComentario: params.descripcionComentario,
            }
        }

    }, {new: true},(err, comentarioAgregado)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!comentarioAgregado) return res.status(400).send({mensaje: 'Erro al agregar comentario a la noticia'})

        return res.status(200).send(comentarioAgregado)
    })

}

function updateComentarioNoticia(req, res){
    var encuestaId = req.params.eId
    var comentariosId = req.params.cId
    var userId = req.params.uId
    var params = req.body

    Noticias.findOneAndUpdate({
        _id: encuestaId,
        "comentarios._id": comentariosId,
        'comentarios.userIdComentario': userId
    },{"comentarios.$.descripcionComentario": params.descripcionComentario},{new: true, useFindAndModify: false},
    (err, comentarioUpdate)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!comentarioUpdate) return res.status(400).send({mensaje: 'Error al editar el comentario'})
        return res.status(200).send(comentarioUpdate)
    })
}

function deleleteComentarioNoticia(req, res){
    var comentarioId = req.params.cId

    Noticias.findOneAndUpdate({ "comentarios._id": comentarioId }, { $pull: { comentarios: {_id: comentarioId}}}, {new: true, useFindAndModify: false}, (err, comentarioDelete)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!comentarioDelete) return res.status(400).send({mensaje: 'Error al elminar comentario'})

        return res.status(200).send({mensaje: 'Se elimino correctamente el comentario con Id: '+comentarioId})
    })
}

function getComentariosNoticia(req, res){
    var noticiasId = req.params.nId

    Noticias.findOne({$or: [{_id: noticiasId}]}).exec((err, comentariosStored)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!comentariosStored) return res.status(400).send({mensaje: 'Error al obtener comentarios'})

        
            return res.status(200).send(comentariosStored)
        
    })
}

module.exports = {
    saveComentarioNoticia,
    updateComentarioNoticia,
    deleleteComentarioNoticia,
    getComentariosNoticia
}
