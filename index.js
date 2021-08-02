'use strict'

var mongoose = require('mongoose')
var app = require('./app')
var User = require('./src/models/user')
var bcrypt = require('bcrypt-nodejs')

mongoose.Promise = global.Promise
mongoose.connect('mongodb+srv://root:<root>@cluster0.xvp7x.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useFindAndModify: true})
    .then(()=>{
        console.log('Estas conectado a la base de datos')

        var user1 = 'Admin'
        var email = 'admin'
        var password = '123456'
        var rol = 'ROL_ADMIN'

        var userModel = new User()

        userModel.img = 'https://th.bing.com/th/id/R.b5191f32201ffaa11c934ef5e8336aa6?rik=oHQqwkVkiV8jsg&riu=http%3a%2f%2fwww.coordinadora.com%2fwp-content%2fuploads%2fsidebar_usuario-corporativo.png&ehk=1xJb2We0RTYHhqlCyflIts8iyhfaNrSLijnToqgjtQg%3d&risl=&pid=ImgRaw'
        userModel.user = user1
        userModel.email = email
        userModel.name = user1
        userModel.rol = rol
        userModel.estado = 'DISPONIBLE'

        User.find({email: userModel.email}).exec((err, userStored)=>{
            if(userStored && userStored.length == 1){
                return console.log('El Admin ya fue creado')
            }else{
                bcrypt.hash(password, null, null, (err, bcryptPassword)=>{
                    userModel.password = bcryptPassword

                    userModel.save((err, userSave)=>{
                        if(err) return res.status(500).send({mensaje: 'Error en la peticion'  + err})
                        if(userSave){
                            return console.log(userSave)
                        }else{
                            return res.status(400).send({mensaje: 'Admin no registrado'})
                        }
                    })
                })
            }
        }) 

        app.listen(process.env.PORT || 3000, ()=>{
            console.log('El Servidor esta corriendo')
        })
    })
    .catch(err=>console.log(err))