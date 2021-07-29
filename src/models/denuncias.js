'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var denunciasSchema = Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    encargadoId: {type: Schema.Types.ObjectId, ref: 'User'},
    descripcion: String,
    nameEncargado: String,
    img : String,
    tipoDenuncia: String,
    status: String
})

module.exports = mongoose.model('Denuncias', denunciasSchema)