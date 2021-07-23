'use strict'

var Noticias = require('../models/noticias')

function saveNoticiasAdmin(req, res){
    var noticiasModel = new Noticias()
    var params = req.body

    if (req.user.rol != "ROL_ADMIN") {
        return res.status(500).send({ mensaje: "Solo el Administrador puede agregar noticias" })
    }

    if(params.titulo && params.descripcion){

        noticiasModel.titulo = params.titulo
        noticiasModel.descripcion = params.descripcion
        noticiasModel.fechaCreacion = params.fechaCreacion
        noticiasModel.img = 'https://th.bing.com/th/id/OIP.g6uTSDCYu_OuguJzEyX2MgHaDF?pid=ImgDet&rs=1'

        Noticias.find({
            $or:[
                {titulo: noticiasModel.titulo},
        ]}).exec((err, noticiasStored)=>{
            if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
            if(noticiasStored && noticiasStored.length >= 1){
                return res.status(400).send({mensaje: 'La noticia o el titulo que intentas ingresar ya existe'})
            }else{
                noticiasModel.save((err, noticiasSave)=>{
                    if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
                    if(noticiasSave){
                        return res.status(200).send(noticiasSave)
                    }else{
                        return res.status(400).send({mensaje: 'Error al guardar la noticia'})
                    }
                })
            }
        })
    }else{
        return res.status(400).send({mensaje: 'Debes de llenar los datos necesarios'})
    }
}

function updateNoticiasAdmin(req, res){
    var noticiasId = req.params.nId
    var update = req.body

    if (req.user.rol != "ROL_ADMIN") {
        return res.status(500).send({ mensaje: "Solo el Administrador puede editar noticias" })
    }

    Noticias.findByIdAndUpdate(noticiasId, update, {new:true}, (err, noticiasUpdate)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!noticiasUpdate) return res.status(400).send({mensaje: 'Error al editar la noticia'})

        return res.status(200).send(noticiasUpdate)
    })
}

function deleteNoticiasAdmin(req, res){
    var noticiasId = req.params.nId

    if (req.user.rol != "ROL_ADMIN") {
        return res.status(500).send({ mensaje: "Solo el Administrador puede eliminar noticias" })
    }

    Noticias.findByIdAndDelete(noticiasId, (err, noticiaDelete)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!noticiaDelete) return res.status(400).send({mensaje: 'Error al eliminar la noticia'})

        return res.status(200).send({mensaje: 'Se elimino correctamente la noticia con id: '+noticiasId})
    })
}

function getNoticias(req, res){

    Noticias.find((err, noticiasStored)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!noticiasStored) return res.status(404).send({mensaje: 'Error al obtener Noticias'})
        if(noticiasStored <= 0){
            return res.status(200).send({mensaje: 'No hay ninguna noticias para mostrar'})
        }else{
            return res.status(200).send(noticiasStored)
        }

    })
}

function getNoticiasId(req, res){
    var noticiasId = req.params.nId

    Noticias.findOne({ $or: [{ _id: noticiasId }] }).exec((err, noticiasStored)=>{
        if(err) return res.status(500).send({mensaje: 'Error en la peticion'})
        if(!noticiasStored) return res.status(400).send({mensaje: 'Error al ver noticia'})

        return res.status(200).send(noticiasStored)
    })
}

module.exports = {
    saveNoticiasAdmin,
    updateNoticiasAdmin,
    deleteNoticiasAdmin,
    getNoticias,
    getNoticiasId
}