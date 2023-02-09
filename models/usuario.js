/*la definición de esquema y modelo de los usuarios*/
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// Definir esquema y modelo
let usuarioSchema = new mongoose.Schema({
    login: {
        type: String,
        required: true,
        minlength: 5,
        trim: true,
        unique: true,
      },
      password: {
        type: String,
        minlength: 8,
        required: true,
        trim: true,
      },
});

//encriptar contraseña
usuarioSchema.pre('save', function (next) {
  const usuario = this;
  if (!usuario.isModified('password')) {
    return next();
  }
  bcrypt.genSalt(10, (error, salt) => {
    if (error) {
      return next(error);
    }
    bcrypt.hash(usuario.password, salt, (error, hash) => {
      if (error) {
        return next(error);
      }
      usuario.password = hash;
      next();
    });
  });
});


const usuario = mongoose.model('usuario', usuarioSchema);

module.exports = usuario;
