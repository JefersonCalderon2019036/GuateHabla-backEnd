'use strict'

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var userSchema = Schema({

    name: String,
    dpi: String,
    user: String,
    email: String,
    password: String,
    estado: String,
    direccion: String,
    telefono: Number,
    img: String,
    rol: String

})

module.exports = mongoose.model('User', userSchema)