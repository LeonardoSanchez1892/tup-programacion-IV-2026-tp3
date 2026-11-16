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

// GET para entregar detalle de vehículo por ID
router.get(
  "/:id",
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    let sql =
      "SELECT id, marca, modelo, patente, anio, capacidad_carga FROM vehiculos WHERE id = ?";
    const [vehiculos] = await db.execute(sql, [id]);

    if (vehiculos.length === 0) {
      return res.status(404).send("Vehículo no encontrado");
    }

    res.send(vehiculos[0]);
  },
);

// POST para crear vehículo
router.post(
  "/",
  validarAutenticacion,
  validarVehiculo,
  verificarValidaciones,
  async (req, res) => {
    const { marca, modelo, patente, anio, capacidad_carga } = req.body;

    const [result] = await db.execute(
      "INSERT INTO vehiculos (marca, modelo, patente, anio, capacidad_carga) VALUES (?, ?, ?, ?, ?)",
      [marca, modelo, patente, anio, capacidad_carga],
    );

    res.status(201).send({
      id: result.insertId,
      marca,
      modelo,
      patente,
      anio,
      capacidad_carga,
    });
  },
);

// PUT para modificar vehículo
router.put(
  "/:id",
  validarAutenticacion,
  validarId,
  validarVehiculo,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const { marca, modelo, patente, anio, capacidad_carga } = req.body;

    const [result] = await db.execute(
      "UPDATE vehiculos SET marca = ?, modelo = ?, patente = ?, anio = ?, capacidad_carga = ? WHERE id = ?",
      [marca, modelo, patente, anio, capacidad_carga, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Vehículo no encontrado");
    }

    res.send({ mensaje: "Vehículo actualizado correctamente" });
  },
);
