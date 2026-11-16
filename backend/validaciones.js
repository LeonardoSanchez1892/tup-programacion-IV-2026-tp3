import { body, param, query, validationResult } from "express-validator";
import passport from "passport";

// Validacion de autenticacion
export const validarAutenticacion = passport.authenticate("jwt", {
  session: false,
});

export const validarId = param("id").isInt({ min: 1 });

export const verificarValidaciones = (req, res, next) => {
  const resultadoValidacion = validationResult(req);
  if (!resultadoValidacion.isEmpty()) {
    return res.status(400).json({
      mensaje: "Parámetros no válidos",
      errores: resultadoValidacion.array(),
    });
  }
  next();
};

// Validaciones para vehículos
export const validarVehiculo = [
  body("marca").isString().notEmpty().withMessage("La marca es obligatoria"),
  body("modelo").isString().notEmpty().withMessage("El modelo es obligatorio"),
  body("patente")
    .isString()
    .notEmpty()
    .withMessage("La patente es obligatoria"),
  body("anio")
    .isInt({ min: 2000, max: new Date().getFullYear() + 1 })
    .withMessage("Año inválido"),
  body("capacidad_carga")
    .isNumeric()
    .withMessage("La capacidad de carga debe ser un número"),
];
