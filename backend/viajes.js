import express from "express";
import { db } from "./db.js";
import {
  validarId,
  validarViaje,
  verificarValidaciones,
  validarAutenticacion,
} from "./validaciones.js";

const router = express.Router();

// GET para obtener todos los viajes
router.get("/", validarAutenticacion, async (req, res) => {
  let sql =
    "SELECT v.id, v.vehiculo_id, veh.marca, veh.modelo, veh.patente, " +
    "v.conductor_id, c.nombre, c.apellido, " +
    "v.fecha_salida, v.fecha_llegada, v.origen, v.destino, v.kilometros, v.observaciones " +
    "FROM viajes v " +
    "JOIN vehiculos veh ON v.vehiculo_id = veh.id " +
    "JOIN conductores c ON v.conductor_id = c.id";

  const [viajes] = await db.execute(sql);
  res.send(viajes);
});

// GET para obtener un viaje por ID
router.get(
  "/:id",
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    let sql =
      "SELECT v.id, v.vehiculo_id, veh.marca, veh.modelo, veh.patente, " +
      "v.conductor_id, c.nombre, c.apellido, " +
      "v.fecha_salida, v.fecha_llegada, v.origen, v.destino, v.kilometros, v.observaciones " +
      "FROM viajes v " +
      "JOIN vehiculos veh ON v.vehiculo_id = veh.id " +
      "JOIN conductores c ON v.conductor_id = c.id " +
      "WHERE v.id = ?";

    const [viajes] = await db.execute(sql, [id]);

    if (viajes.length === 0) {
      return res.status(404).send("Viaje no encontrado");
    }

    res.send(viajes[0]);
  },
);

// POST para crear un viaje
router.post(
  "/",
  validarAutenticacion,
  validarViaje,
  verificarValidaciones,
  async (req, res) => {
    const {
      vehiculo_id,
      conductor_id,
      fecha_salida,
      fecha_llegada,
      origen,
      destino,
      kilometros,
      observaciones,
    } = req.body;

    const [result] = await db.execute(
      "INSERT INTO viajes (vehiculo_id, conductor_id, fecha_salida, fecha_llegada, origen, destino, kilometros, observaciones) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones || null,
      ],
    );

    res.status(201).send({
      id: result.insertId,
      vehiculo_id,
      conductor_id,
      fecha_salida,
      fecha_llegada,
      origen,
      destino,
      kilometros,
      observaciones,
    });
  },
);

// PUT para actualizar un viaje
router.put(
  "/:id",
  validarAutenticacion,
  validarId,
  validarViaje,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const {
      vehiculo_id,
      conductor_id,
      fecha_salida,
      fecha_llegada,
      origen,
      destino,
      kilometros,
      observaciones,
    } = req.body;

    const [result] = await db.execute(
      "UPDATE viajes SET vehiculo_id=?, conductor_id=?, fecha_salida=?, fecha_llegada=?, origen=?, destino=?, kilometros=?, observaciones=? WHERE id=?",
      [
        vehiculo_id,
        conductor_id,
        fecha_salida,
        fecha_llegada,
        origen,
        destino,
        kilometros,
        observaciones || null,
        id,
      ],
    );

    if (result.affectedRows === 0) {
      return res.status(404).send("Viaje no encontrado");
    }

    res.send({ mensaje: "Viaje actualizado correctamente" });
  },
);

// DELETE para eliminar un viaje
router.delete(
  "/:id",
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    const [result] = await db.execute("DELETE FROM viajes WHERE id=?", [id]);

    if (result.affectedRows === 0) {
      return res.status(404).send("Viaje no encontrado");
    }

    res.send({ mensaje: "Viaje eliminado correctamente" });
  },
);

export default router;
