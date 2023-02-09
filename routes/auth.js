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

//GENERAR USUARIOS
router.get("/usuarios", (req, res) => {
  try {
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
