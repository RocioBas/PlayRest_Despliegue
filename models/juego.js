/*la definición de esquema y modelo de edicion y juego*/
const mongoose = require('mongoose');

let edicionSchema = new mongoose.Schema({
    edicion:{
        type: String,
        required: true
    },
    anyo:{
        type: Number,
        min: 2000,
        max: new Date().getFullYear() 
    }
});

let juegoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        minlength: 6,
        trim: true         
    },
    descripcion: {
        type: String,
        required: true,
        trim: true
    },
    edad: {
        type: Number,
        required: true,
        min: 1, 
        max: 100
    },
    jugadores: {
        type: Number,
        required: true
    },
    tipo: { 
        type: String,
        required: true,
        enum: ["rol", "escape", "dados", "fichas", "cartas", "tablero"]
    },
    precio: {
        type: Number,
        required: true,
        min: 1 
    },
    imagen: { 
        type: String,
        required: false
    },
    ediciones: [edicionSchema]
});

let juego = mongoose.model('juegos', juegoSchema);

module.exports = juego;
