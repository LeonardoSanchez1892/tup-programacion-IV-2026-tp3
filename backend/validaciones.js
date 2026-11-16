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

// Validacion de filtros de vehiculos
export const validarFiltrosVehiculos = [
  query("marca").optional().isString().trim(),
  query("modelo").optional().isInt({ min: 0 }),
  query("patente").optional().isString().trim(),
];

// Validaciones para filtros de viajes
export const validarFiltrosViajes = [
  query("vehiculo_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de vehículo debe ser un número válido"),
  query("conductor_id")
    .optional()
    .isInt({ min: 1 })
    .withMessage("El ID de conductor debe ser un número válido"),
  query("origen").optional().isString().trim(),
  query("destino").optional().isString().trim(),
];

// Validaciones para crear/editar viajes
export const validarViaje = [
  body("vehiculo_id")
    .isInt({ min: 1 })
    .withMessage("El vehículo es obligatorio y debe ser un ID válido"),
  body("conductor_id")
    .isInt({ min: 1 })
    .withMessage("El conductor es obligatorio y debe ser un ID válido"),
  body("fecha_salida")
    .isISO8601()
    .withMessage("La fecha de salida debe tener un formato válido"),
  body("fecha_llegada")
    .isISO8601()
    .withMessage("La fecha de llegada debe tener un formato válido"),
  body("origen")
    .isString()
    .notEmpty()
    .isLength({ max: 150 })
    .withMessage("El origen es obligatorio (máx. 150 caracteres)"),
  body("destino")
    .isString()
    .notEmpty()
    .isLength({ max: 150 })
    .withMessage("El destino es obligatorio (máx. 150 caracteres)"),
  body("kilometros")
    .isFloat({ min: 0.01 })
    .withMessage("Los kilómetros deben ser un número mayor a 0"),
  body("observaciones").optional({ nullable: true }).isString(),
];

// Validaciones para filtros de conductores
export const validarFiltrosConductores = [
  query("nombre").optional().isString().trim(),
  query("apellido").optional().isString().trim(),
  query("numero_documento").optional().isString().trim(),
];

// Validaciones para crear/editar conductores
export const validarConductor = [
  body("nombre")
    .isString()
    .notEmpty()
    .isLength({ max: 100 })
    .withMessage("El nombre es obligatorio"),
  body("apellido")
    .isString()
    .notEmpty()
    .isLength({ max: 100 })
    .withMessage("El apellido es obligatorio"),
  body("numero_documento")
    .isString()
    .notEmpty()
    .isLength({ max: 20 })
    .withMessage("El número de documento es obligatorio"),
  body("numero_licencia")
    .isString()
    .notEmpty()
    .isLength({ max: 30 })
    .withMessage("El número de licencia es obligatorio"),
  body("fecha_alta_licencia")
    .isISO8601()
    .withMessage("La fecha de alta de licencia debe ser válida (YYYY-MM-DD)"),
  body("fecha_vencimiento_licencia")
    .isISO8601()
    .withMessage(
      "La fecha de vencimiento de licencia debe ser válida (YYYY-MM-DD)",
    ),
];
