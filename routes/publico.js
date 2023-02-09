//Enrutador de usuarios publicos
const express = require("express");

let router = express.Router();
let Juego = require(__dirname + "/../models/juego.js");

// raiz publico_index
router.get("/", (req, res) => {
  try {
    res.render("publico_index");
  } catch (error) {
    res.render("publico_error");
  }
});

// publico_index buscando X nombre
router.get("/buscar", (req, res) => {
  const nombre = req.query.nombre;
  Juego.find({ nombre: { $regex: `.*${nombre}.*` } })
    .then((resultados) => {
      if (resultados.length > 0) {
        res.render("publico_index", { juegos: resultados });
      } else {
        res.render("publico_index", { error: "No se encontraron juegos" });
      }
    })
    .catch((error) => {
      res.render("publico_error");
    });
});

// publico_juego de X juego
router.get("/juegos/:id", (req, res) => {
  Juego.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("publico_juego", { juego: resultado });
      } else {
        res.render("publico_error", { error: "Juego no encontrado" });
      }
    })
    .catch((error) => {
      res.render("publico_error");
    });
});

module.exports = router;
