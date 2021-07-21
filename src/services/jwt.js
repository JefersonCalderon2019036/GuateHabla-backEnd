'use strict'

var jwt = require('jwt-simple')
var moment = require('moment')
var secret = 'IN6BM'

exports.createToken = function(user){
    var payload = {
        sub: user._id,
        name: user.name,
        nick: user.nick,
        username: user.surname,
        email: user.email,
        rol: user.rol,
        image: user.image,
        iat: moment().unix(),
        exp: moment().add(30, 'days').unix
    }

    return jwt.encode(payload, secret)
}