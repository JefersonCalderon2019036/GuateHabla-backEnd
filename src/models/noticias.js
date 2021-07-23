'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var noticiasSchema = Schema({
    titulo: String,
    descripcion: String,
    fechaCreacion: String,
    img: String,
    comentarios: [{
        userIdComentario: {type: Schema.Types.ObjectId, ref: 'User'},
        descripcionComentario: String
    }]
})

module.exports = mongoose.model('Noticias', noticiasSchema)