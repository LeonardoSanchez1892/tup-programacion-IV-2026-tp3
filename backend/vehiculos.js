import express from "express";
import { db } from "./db.js";
import {
  validarAutenticacion,
  validarFiltrosVehiculos,
  validarId,
  validarVehiculo,
  verificarValidaciones,
} from "./validaciones.js";

const router = express.Router();

// GET para entregar listado de vehículos
router.get(
  "/",
  validarAutenticacion,
  validarFiltrosVehiculos,
  verificarValidaciones,
  async (req, res) => {
    const filtros = [];
    const parametros = [];

    const { marca, modelo, patente } = req.query;

    if (marca) {
      filtros.push("marca LIKE ?");
      parametros.push(`%${marca}%`);
    }

    if (modelo) {
      filtros.push("modelo LIKE ?");
      parametros.push(`%${modelo}%`);
    }

    if (patente) {
      filtros.push("patente LIKE ?");
      parametros.push(`%${patente}%`);
    }

    let sql =
      "SELECT id, marca, modelo, patente, anio, capacidad_carga FROM vehiculos";

    if (filtros.length > 0) {
      sql += " WHERE " + filtros.join(" AND ");
    }

    const [vehiculos] = await db.execute(sql, parametros);
    res.send(vehiculos);
  },
);
