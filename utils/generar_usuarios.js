// Archivo js para generar usuarios en la Base de datos
const mongoose = require("mongoose");
const Usuario = require(__dirname + "/../models/usuario");
mongoose.connect('mongodb://mymongodb/playrest_v3');
Usuario.collection.drop();

let usu1 = new Usuario({
  login: "maycalle",
  password: "12345678",
});
usu1.save();
let usu2 = new Usuario({
  login: "rosamaria",
  password: "87654321",
});
let usu3 = new Usuario({
  login: "pepita",
  password: "12345678",
});
usu3.save();
usu2.save();
