import express from "express";
import { db } from "./db.js";
import {
  validarAutenticacion,
  validarConductor,
  validarFiltrosConductores,
  validarId,
  verificarValidaciones,
} from "./validaciones.js";

const router = express.Router();

// GET para entregar listado de conductores
router.get(
  "/",
  validarAutenticacion,
  validarFiltrosConductores,
  verificarValidaciones,
  async (req, res) => {
    const filtros = [];
    const parametros = [];

    const { nombre, apellido, numero_documento } = req.query;

    if (nombre) {
      filtros.push("nombre LIKE ?");
      parametros.push(`%${nombre}%`);
    }

    if (apellido) {
      filtros.push("apellido LIKE ?");
      parametros.push(`%${apellido}%`);
    }

    if (numero_documento) {
      filtros.push("numero_documento LIKE ?");
      parametros.push(`%${numero_documento}%`);
    }

    let sql =
      "SELECT id, nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia FROM conductores";

    if (filtros.length > 0) {
      sql += " WHERE " + filtros.join(" AND ");
    }

    const [conductores] = await db.execute(sql, parametros);
    res.send(conductores);
  },
);

// GET para entregar detalle de conductor por ID
router.get(
  "/:id",
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    const [conductores] = await db.execute(
      "SELECT id, nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia FROM conductores WHERE id = ?",
      [id],
    );

    if (conductores.length === 0) {
      return res.status(404).send("Conductor no encontrado");
    }

    res.send(conductores[0]);
  },
);

// POST para crear conductor
router.post(
  "/",
  validarAutenticacion,
  validarConductor,
  verificarValidaciones,
  async (req, res) => {
    const {
      nombre,
      apellido,
      numero_documento,
      numero_licencia,
      fecha_alta_licencia,
      fecha_vencimiento_licencia,
    } = req.body;

    try {
      const [result] = await db.execute(
        "INSERT INTO conductores (nombre, apellido, numero_documento, numero_licencia, fecha_alta_licencia, fecha_vencimiento_licencia) VALUES (?, ?, ?, ?, ?, ?)",
        [
          nombre,
          apellido,
          numero_documento,
          numero_licencia,
          fecha_alta_licencia,
          fecha_vencimiento_licencia,
        ],
      );

      res.status(201).send({
        id: result.insertId,
        nombre,
        apellido,
        numero_documento,
        numero_licencia,
        fecha_alta_licencia,
        fecha_vencimiento_licencia,
      });
    } catch (e) {
      res.status(400).send({
        mensaje:
          "Error al crear conductor. Verifique que el documento o licencia no estén duplicados.",
      });
    }
  },
);

// PUT para modificar conductor
router.put(
  "/:id",
  validarAutenticacion,
  validarId,
  validarConductor,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);
    const {
      nombre,
      apellido,
      numero_documento,
      numero_licencia,
      fecha_alta_licencia,
      fecha_vencimiento_licencia,
    } = req.body;

    try {
      const [result] = await db.execute(
        "UPDATE conductores SET nombre = ?, apellido = ?, numero_documento = ?, numero_licencia = ?, fecha_alta_licencia = ?, fecha_vencimiento_licencia = ? WHERE id = ?",
        [
          nombre,
          apellido,
          numero_documento,
          numero_licencia,
          fecha_alta_licencia,
          fecha_vencimiento_licencia,
          id,
        ],
      );

      if (result.affectedRows === 0) {
        return res.status(404).send("Conductor no encontrado");
      }

      res.send({ mensaje: "Conductor actualizado correctamente" });
    } catch (e) {
      res.status(400).send({
        mensaje:
          "Error al actualizar conductor. Verifique que el documento o licencia no estén duplicados.",
      });
    }
  },
);

// DELETE para eliminar conductor
router.delete(
  "/:id",
  validarAutenticacion,
  validarId,
  verificarValidaciones,
  async (req, res) => {
    const id = Number(req.params.id);

    try {
      const [result] = await db.execute(
        "DELETE FROM conductores WHERE id = ?",
        [id],
      );

      if (result.affectedRows === 0) {
        return res.status(404).send("Conductor no encontrado");
      }

      res.send({ mensaje: "Conductor eliminado correctamente" });
    } catch (e) {
      res.status(400).send({
        mensaje:
          "No se puede eliminar el conductor porque tiene viajes asociados",
      });
    }
  },
);

export default router;
