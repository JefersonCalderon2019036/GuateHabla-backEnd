'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'IN6BM'

exports.ensureAuth = function(req, res, next){
    if(!req.headers.authorization){
        return res.status(200).send({mesagge: 'No tienes la cabezera de autenticacion'})
    }

    var token = req.headers.authorization.replace(/['"]+/g, '')

    try{
        var payload = jwt.decode(token, secret)


        if(payload.exp <= moment().unix()){
            return res.status(401).send({mesagge: 'El token ha expirado'})
        }

    }catch(ex){
        return res.status(404).send({mesagge: 'El token no es valido'})
    }

    req.user = payload

    next()
    

}