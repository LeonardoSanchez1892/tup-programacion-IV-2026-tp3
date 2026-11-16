import express from "express";
import { db } from "./db.js";
import {
  validarAutenticacion,
  validarId,
  verificarValidaciones,
} from "./validaciones.js";
import { body, param } from "express-validator";
import bcrypt from "bcrypt";

const router = express.Router();

router.get("/", validarAutenticacion, async (req, res) => {
  if (!req.user) {
    return res.status(401).send("Usuario no autorizado");
  }

  const [usuarios] = await db.execute(
    "SELECT id, nombre, email, password FROM usuarios",
  );

  res.json(usuarios);
});

router.post(
  "/",
  [
    body("nombre").isAlpha("es-ES").isLength({ max: 50 }),
    body("email").isEmail().isLength({ max: 50 }),
    body("password").isStrongPassword({
      minLength: 8, // Minimo de 8 caracteres
      minLowercase: 1, // Al menos una letra en minusculas
      minUppercase: 0, // Letras mayusculas opcionales
      minNumbers: 1, // Al menos un número
      minSymbols: 0, // Símbolos opcionales
    }),
  ],
  verificarValidaciones,
  async (req, res) => {
    const { nombre, email, password } = req.body;

    // Creamos Hash de la contraseña con bcrypt
    const hashedPassword = await bcrypt.hash(password, 12);

    const [result] = await db.execute(
      "INSERT INTO usuarios (nombre, email, password) VALUES (?,?,?)",
      [nombre, email, hashedPassword],
    );

    res.status(201).json({ id: result.insertId, nombre, email, password });
  },
);

export default router;
