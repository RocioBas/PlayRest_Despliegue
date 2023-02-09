/*
Ejercicio de desarrollo de una web con Express, sobre la base de datos
de "playrest_v3".
Se definirán distintas vistas en Nunjucks para mostrar información de los juegos y poderlos
insertar, borrar, etc.
*/

// Carga de librerías
const express = require('express');
const session = require('express-session');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const nunjucks = require('nunjucks');
const methodOverride = require('method-override');

// Enrutadores
const juegos = require(__dirname + '/routes/juegos');
const auth = require(__dirname + '/routes/auth');
const publico = require(__dirname + '/routes/publico');

// Conectar con BD en Mongo 
mongoose.connect('mongodb://localhost:27017/playrest_v3', 
    {useNewUrlParser: true});

// Inicializar Express
let app = express();

// Configuramos motor Nunjucks
nunjucks.configure('views', {
    autoescape: true,
    express: app
});

// Configuración de la sesión en la aplicación
app.use(session({
    secret: '1234',
    resave: true,
    saveUninitialized: false
}));

// Poder acceder a la sesión desde las vistas
app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

// Asignación del motor de plantillas
app.set('view engine', 'njk');

// Cargar middleware body-parser para peticiones POST y PUT
// y enrutadores
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Middleware para procesar otras peticiones que no sean GET o POST
app.use(methodOverride(function (req, res) {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
      let method = req.body._method;
      delete req.body._method;
      return method;
    } 
}));
// Cargamos ahora también la carpeta "public" para el CSS propio
app.use('/public', express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/node_modules/bootstrap/dist'));
app.use('/admin', juegos);
app.use('/', publico);
app.use('/auth', auth) 

// Puesta en marcha del servidor
app.listen(8080);