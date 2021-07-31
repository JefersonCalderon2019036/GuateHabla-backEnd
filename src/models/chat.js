'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema;

var chatSchema = Schema({
    userId: {type: Schema.Types.ObjectId, ref: 'User'},
    username: String,
    encargadoId: {type: Schema.Types.ObjectId, ref: 'User'},
    nameEncargado: String,
    Messages: [{
        idUserMessage: {type: Schema.Types.ObjectId, ref: 'User'},
        mensaje: String
    }],
    status: String
})

module.exports = mongoose.model('Chat', chatSchema)
