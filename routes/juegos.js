//Enrutador de administradores 
const express = require("express");
const multer = require("multer");

let Juego = require(__dirname + "/../models/juego.js");
let autenticacion = require(__dirname + "/../utils/auth.js");
let router = express.Router();

let storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

let uploads = multer({ storage: storage });

// Listado general get /juegos
router.get("/juegos", autenticacion, (req, res) => {
  Juego.find()
    .then((resultado) => {
      res.render("admin_juegos", { juegos: resultado });
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

// GET /juegos/nuevo
router.get("/juegos/nuevo", autenticacion, (req, res) => {
  try {
    res.render("admin_juegos_form");
  } catch (error) {
    res.render("admin_error");
  }
});

// GET /juegos/editar/:id
router.get("/juegos/editar/:id", autenticacion, (req, res) => {
  Juego.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("admin_juegos_form", { juego: resultado });
      } else {
        res.render("admin_error", { error: "Juego no encontrado" });
      }
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

// GET admin_juego de X juego
router.get("/juegos/:id", (req, res) => {
  Juego.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("admin_juego", { juego: resultado });
      } else {
        res.render("admin_error", { error: "Juego no encontrado" });
      }
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

// POST /juegos
router.post("/juegos", uploads.single("imagen"), autenticacion, (req, res) => {
  let juegoNuevo = new Juego({
    nombre: req.body.nombre,
    descripcion: req.body.descripcion,
    edad: req.body.edad,
    jugadores: req.body.jugadores,
    tipo: req.body.tipo,
    precio: req.body.precio,
    imagen: req.file.filename,
  });
  juegoNuevo
    .save()
    .then((resultado) => {
      res.redirect(req.baseUrl + "/juegos") ;
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

// PUT /juegos/:id
router.put(
  "/juegos/:id",
  uploads.single("imagen"),
  autenticacion,
  (req, res) => {
    if (req.body.imagen) {
      Juego.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            edad: req.body.edad,
            jugadores: req.body.jugadores,
            tipo: req.body.tipo,
            precio: req.body.precio,
            imagen: req.file.filename,
          },
        },
        { new: true, runValidators: true }
      )
        .then((resultado) => {
          res.redirect(req.baseUrl + "/juegos");
        })
        .catch((error) => {
          res.render("admin_error");
        });
    } else {
      Juego.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            edad: req.body.edad,
            jugadores: req.body.jugadores,
            tipo: req.body.tipo,
            precio: req.body.precio,
          },
        },
        { new: true, runValidators: true }
      )
        .then((resultado) => {
          res.redirect(req.baseUrl + "/juegos");
        })
        .catch((error) => {
          res.render("admin_error");
        });
    }
  }
);

// DELETE /juegos/:id
router.delete("/juegos/:id", autenticacion, (req, res) => {
  Juego.findByIdAndRemove(req.params.id)
    .then((resultado) => {
      res.redirect(req.baseUrl + "/juegos") ;
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

// GET /juegos/edicion/:id
router.get("/juegos/edicion/:id", autenticacion, (req, res) => {
  Juego.findById(req.params["id"])
    .then((resultado) => {
      if (resultado) {
        res.render("admin_edicion_form", { juego: resultado });
      } else {
        res.render("admin_error");
      }
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

//POST /juegos/ediciones/:idJuego
router.post("/juegos/edicion/:idJuego", autenticacion, (req, res) => {
  Juego.findById(req.params.idJuego)
    .then((resultado) => {
      if (resultado) {
        resultado.ediciones.push({
          edicion: req.body.edicion,
          anyo: req.body.anyo,
        });
        resultado
          .save()
          .then(() => {
            res.redirect(req.baseUrl + "/juegos");
          })
          .catch(() => {
            res.render("admin_error");
          });
      } else res.render("admin_error");
    })
    .catch((error) => {
      res.render("admin_error");
    });
});

//DELETE /juegos/ediciones/:idJuego/:idEdicion
router.delete(
  "/juegos/ediciones/:idJuego/:idEdicion",
  autenticacion,
  (req, res) => {
    Juego.findById(req.params.idJuego)
      .then((juegoBuscado) => {
        if (juegoBuscado) {
          if (
            juegoBuscado.ediciones.filter(
              (datos) => datos._id == req.params.idEdicion
            ).length > 0
          ) {
            const resultado = juegoBuscado.ediciones.filter(
              (datos) => datos._id != req.params.idEdicion
            );
            juegoBuscado.ediciones = resultado;

            juegoBuscado
              .save()
              .then((resultado) => {
                res.redirect(req.baseUrl + "/juegos");
              })
              .catch((error) => {
                res.render("admin_error");
              });
          } else res.render("admin_error");
        } else res.render("admin_error");
      })
      .catch((error) => {
        res.render("admin_error");
      });
  }
);

module.exports = router;
