import { useCallback, useEffect, useState } from "react";

const Vehiculos = () => {
  return (
    <>
      <h1>Vehiculos</h1>
      <button>Agregar Vehiculo</button>
      <table>
        <thead>
          <th>ID</th>
          <th>Marca</th>
          <th>Modelo</th>
          <th>Patente</th>
          <th>Año</th>
          <th>Cap. de Carga</th>
          <th>Acción</th>
        </thead>
        <tbody>
          <tr>
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

export default Vehiculos;
