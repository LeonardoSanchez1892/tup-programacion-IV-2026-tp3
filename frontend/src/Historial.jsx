import { useEffect, useState } from "react";
import { useAuth } from "./Auth.jsx";
import "./Vehiculos.css";

const viajeInicial = {
  vehiculo_id: "",
  conductor_id: "",
  fecha_salida: "",
  fecha_llegada: "",
  origen: "",
  destino: "",
  kilometros: "",
  observaciones: "",
};

const mostrarKilometros = (kilometros) =>
  Number(kilometros).toLocaleString("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

const Historial = () => {
  const [viajes, setViajes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [conductores, setConductores] = useState([]);
  const [filtros, setFiltros] = useState({ vehiculo_id: "", conductor_id: "" });
  const [formulario, setFormulario] = useState(viajeInicial);
  const [recarga, setRecarga] = useState(0);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { fetchAuth } = useAuth();

  useEffect(() => {
    let ignorar = false;
    const cargarDatos = async () => {
      try {
        const [respuestaViajes, respuestaVehiculos, respuestaConductores] =
          await Promise.all([
            fetchAuth("http://localhost:3000/viajes"),
            fetchAuth("http://localhost:3000/vehiculos"),
            fetchAuth("http://localhost:3000/conductores"),
          ]);

        if (
          !respuestaViajes.ok ||
          !respuestaVehiculos.ok ||
          !respuestaConductores.ok
        ) {
          throw new Error("No se pudieron cargar los datos.");
        }

        const [datosViajes, datosVehiculos, datosConductores] =
          await Promise.all([
            respuestaViajes.json(),
            respuestaVehiculos.json(),
            respuestaConductores.json(),
          ]);

        if (!ignorar) {
          setViajes(datosViajes);
          setVehiculos(datosVehiculos);
          setConductores(datosConductores);
          setError("");
        }
      } catch (e) {
        if (!ignorar) {
          setError(e.message);
        }
      }
    };

    cargarDatos();
    return () => {
      ignorar = true;
    };
  }, [fetchAuth, recarga]);

  const cambiarCampo = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const guardarViaje = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const datos = {
      ...formulario,
      vehiculo_id: Number(formulario.vehiculo_id),
      conductor_id: Number(formulario.conductor_id),
      kilometros: Number(formulario.kilometros),
      observaciones: formulario.observaciones || null,
    };

    try {
      const response = await fetchAuth("http://localhost:3000/viajes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setFormulario(viajeInicial);
      setMensaje("Viaje registrado correctamente.");
      setRecarga((actual) => actual + 1);
    } catch (e) {
      setError(e.message || "No se pudo registrar el viaje.");
    }
  };

  const viajesFiltrados = viajes.filter(
    (viaje) =>
      (!filtros.vehiculo_id ||
        String(viaje.vehiculo_id) === filtros.vehiculo_id) &&
      (!filtros.conductor_id ||
        String(viaje.conductor_id) === filtros.conductor_id),
  );

  const kilometrosFiltrados = viajesFiltrados.reduce(
    (total, viaje) => total + Number(viaje.kilometros),
    0,
  );

  const kilometrosVehiculo = (vehiculoId) =>
    viajes
      .filter((viaje) => viaje.vehiculo_id === vehiculoId)
      .reduce((total, viaje) => total + Number(viaje.kilometros), 0);

  const kilometrosConductor = (conductorId) =>
    viajes
      .filter((viaje) => viaje.conductor_id === conductorId)
      .reduce((total, viaje) => total + Number(viaje.kilometros), 0);

  return (
    <>
      <h1>Historial de viajes</h1>

      <h2>Registrar viaje</h2>
      {error && <p className="mensaje-error">{error}</p>}
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      <form className="formulario-datos" onSubmit={guardarViaje}>
        <label>
          Vehículo
          <select
            name="vehiculo_id"
            value={formulario.vehiculo_id}
            onChange={cambiarCampo}
            required
          >
            <option value="">Seleccionar vehículo</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id} value={vehiculo.id}>
                {vehiculo.marca} {vehiculo.modelo} ({vehiculo.patente})
              </option>
            ))}
          </select>
        </label>
        <label>
          Conductor
          <select
            name="conductor_id"
            value={formulario.conductor_id}
            onChange={cambiarCampo}
            required
          >
            <option value="">Seleccionar conductor</option>
            {conductores.map((conductor) => (
              <option key={conductor.id} value={conductor.id}>
                {conductor.nombre} {conductor.apellido}
              </option>
            ))}
          </select>
        </label>
        <label>
          Fecha de salida
          <input
            name="fecha_salida"
            type="datetime-local"
            value={formulario.fecha_salida}
            onChange={cambiarCampo}
            required
          />
        </label>
        <label>
          Fecha de llegada
          <input
            name="fecha_llegada"
            type="datetime-local"
            value={formulario.fecha_llegada}
            onChange={cambiarCampo}
            required
          />
        </label>
        <label>
          Origen
          <input
            name="origen"
            value={formulario.origen}
            onChange={cambiarCampo}
            maxLength="150"
            required
          />
        </label>
        <label>
          Destino
          <input
            name="destino"
            value={formulario.destino}
            onChange={cambiarCampo}
            maxLength="150"
            required
          />
        </label>
        <label>
          Kilómetros
          <input
            name="kilometros"
            type="number"
            min="0.01"
            step="0.01"
            value={formulario.kilometros}
            onChange={cambiarCampo}
            required
          />
        </label>
        <label>
          Observaciones
          <textarea
            name="observaciones"
            value={formulario.observaciones}
            onChange={cambiarCampo}
          />
        </label>
        <div className="acciones-formulario">
          <button type="submit">Guardar viaje</button>
        </div>
      </form>

      <h2>Consultar historial</h2>
      <div className="filtros-historial">
        <label>
          Filtrar por vehículo
          <select
            value={filtros.vehiculo_id}
            onChange={(e) =>
              setFiltros({ ...filtros, vehiculo_id: e.target.value })
            }
          >
            <option value="">Todos los vehículos</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id} value={vehiculo.id}>
                {vehiculo.marca} {vehiculo.modelo} ({vehiculo.patente})
              </option>
            ))}
          </select>
        </label>
        <label>
          Filtrar por conductor
          <select
            value={filtros.conductor_id}
            onChange={(e) =>
              setFiltros({ ...filtros, conductor_id: e.target.value })
            }
          >
            <option value="">Todos los conductores</option>
            {conductores.map((conductor) => (
              <option key={conductor.id} value={conductor.id}>
                {conductor.nombre} {conductor.apellido}
              </option>
            ))}
          </select>
        </label>
      </div>
      <p className="total-kilometros">
        Total de kilómetros de los viajes mostrados:{" "}
        {mostrarKilometros(kilometrosFiltrados)} km
      </p>

      <table className="tabla-datos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Vehículo</th>
            <th>Conductor</th>
            <th>Fecha de salida</th>
            <th>Fecha de llegada</th>
            <th>Origen</th>
            <th>Destino</th>
            <th>Kilómetros</th>
            <th>Observaciones</th>
          </tr>
        </thead>
        <tbody>
          {viajesFiltrados.map((viaje) => (
            <tr key={viaje.id}>
              <td>{viaje.id}</td>
              <td>
                {viaje.marca} {viaje.modelo} ({viaje.patente})
              </td>
              <td>
                {viaje.nombre} {viaje.apellido}
              </td>
              <td>{viaje.fecha_salida}</td>
              <td>{viaje.fecha_llegada}</td>
              <td>{viaje.origen}</td>
              <td>{viaje.destino}</td>
              <td>{viaje.kilometros}</td>
              <td>{viaje.observaciones}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Kilómetros por vehículo</h2>
      <table className="tabla-datos">
        <thead>
          <tr>
            <th>Vehículo</th>
            <th>Total de kilómetros</th>
          </tr>
        </thead>
        <tbody>
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.id}>
              <td>
                {vehiculo.marca} {vehiculo.modelo} ({vehiculo.patente})
              </td>
              <td>{mostrarKilometros(kilometrosVehiculo(vehiculo.id))}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Kilómetros por conductor</h2>
      <table className="tabla-datos">
        <thead>
          <tr>
            <th>Conductor</th>
            <th>Total de kilómetros</th>
          </tr>
        </thead>
        <tbody>
          {conductores.map((conductor) => (
            <tr key={conductor.id}>
              <td>
                {conductor.nombre} {conductor.apellido}
              </td>
              <td>{mostrarKilometros(kilometrosConductor(conductor.id))}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Historial;
