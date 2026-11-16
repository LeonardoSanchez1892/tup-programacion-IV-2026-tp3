import express from "express";
import { db } from "./db.js";
import { verificarValidaciones } from "./validaciones.js";
import { body } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import passport from "passport";
import { Strategy, ExtractJwt } from "passport-jwt";

const router = express.Router();

export function authConfig() {
  // Configuracion de passport-jwt
  const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  };

  // Estrategia jwt
  passport.use(
    new Strategy(jwtOptions, async (payload, next) => {
      next(null, payload);
    }),
  );
}

router.post(
  "/login",
  [
    body("email").isEmail(),
    body("password").isAlphanumeric("es-ES").isLength({ max: 50 }),
  ],
  verificarValidaciones,
  async (req, res) => {
    const { email, password } = req.body;

    // Consultar por el usuario a la base de datos
    const [usuarios] = await db.execute(
      "SELECT * FROM usuarios WHERE email=?",
      [email],
    );

    if (usuarios.length === 0) {
      return res.status(400).json("Usuario inválido");
    }

    // Verificar contraseña
    const hashedPassword = usuarios[0].password;

    const passwordComparada = await bcrypt.compare(password, hashedPassword);

    if (!passwordComparada) {
      return res.status(400).json("Contraseña inválida");
    }

    // Generar jwt
    const payload = {
      userId: usuarios[0].id,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "240m",
    });

    // Devolver token y nombre de usuario
    res.json({
      token,
      email: usuarios[0].email,
    });
  },
);

export default router;
