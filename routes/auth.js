//Enrutador para auth
const express = require("express");
const bcrypt = require('bcrypt');

let Usuario = require(__dirname + "/../models/usuario.js");
let router = express.Router();

// GET /auth/login
router.get("/login", (req, res) => {
  try {
    res.render("auth_login");
  } catch (error) {
    res.render("publico_error");
  }
});

//POST /auth/login
router.post("/login", (req, res) => {
  let login = req.body.login;
  let password = req.body.password;

  Usuario.findOne({ login: login }, async (err, usuario) => {
    if (err) {
      return res.render("auth_login", { error: "Usuario incorrecto" });
    }
    if (!usuario) {
      return res.render("auth_login", { error: "Usuario incorrecto" });
    }
    const passValid = await bcrypt.compare(password, usuario.password);

    if (!passValid) {
      return res.render("auth_login", { error: "Usuario incorrecto" });
    } else {
      req.session.usuario = usuario.login;
      req.session.rol = usuario.rol;
      res.redirect("/admin/juegos");
    }
  });
});

// Ruta para logout
router.get("/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

module.exports = router;
