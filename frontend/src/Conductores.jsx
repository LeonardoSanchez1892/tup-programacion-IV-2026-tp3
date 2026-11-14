import React, { useState } from "react";
import "./Layout.css";

const Conductores = () => {
  return (
    <>
      <h1>Conductores</h1>
      <button>Agregar Conductor</button>
      <table>
        <thead>
          <th>ID</th>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Num. Documento</th>
          <th>Num. Licencia</th>
          <th>Fecha de Alta de Licencia</th>
          <th>Fecha de Vencimiento de Licencia</th>
          <th>Accion</th>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>1</td>
            <td>
              <button>Editar</button>
              <button>Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
};

export default Conductores;
