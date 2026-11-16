import { useEffect, useState } from "react";
import "./Vehiculos.css";
import { useAuth } from "./Auth.jsx";
import { VehiculosFiltros } from "./VehiculosFiltros.jsx";

const vehiculoInicial = {
  marca: "",
  modelo: "",
  patente: "",
  anio: "",
  capacidad_carga: "",
};

const Vehiculos = () => {
  const [vehiculos, setVehiculos] = useState([]);
  const [filtros, setFiltros] = useState({
    marca: "",
    modelo: "",
    patente: "",
  });
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [formulario, setFormulario] = useState(vehiculoInicial);
  const [recargar, setRecargar] = useState(0);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { fetchAuth } = useAuth();

  useEffect(() => {
    const obtenerVehiculos = async () => {
      const url = new URL("http://localhost:3000/vehiculos");

      if (filtros.marca) {
        url.searchParams.append("marca", filtros.marca);
      }
      if (filtros.modelo !== "") {
        url.searchParams.append("modelo", filtros.modelo);
      }
      if (filtros.patente) {
        url.searchParams.append("patente", filtros.patente);
      }

      const response = await fetchAuth(url);
      if (!response.ok) {
        console.error("Fallo al obtener vehiculos");
        setVehiculos([]);
        return;
      }
      const vehiculos = await response.json();
      setVehiculos(vehiculos);
    };

    obtenerVehiculos();
  }, [filtros, fetchAuth, recargar]);

  const cambiarCampo = (e) => {
    setFormulario((actual) => ({
      ...actual,
      [e.target.name]: e.target.value,
    }));
  };

  const agregarVehiculo = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const datos = {
      ...formulario,
      anio: Number(formulario.anio),
      capacidad_carga: Number(formulario.capacidad_carga),
    };

    try {
      const response = await fetchAuth("http://localhost:3000/vehiculos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(datos),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setFormulario(vehiculoInicial);
      setMostrarFormulario(false);
      setMensaje("Vehículo agregado correctamente.");
      setRecargar((actual) => actual + 1);
    } catch (e) {
      setError(e.message || "No se pudo agregar el vehículo.");
    }
  };

  return (
    <>
      <h1>Vehiculos</h1>
      <VehiculosFiltros filtros={filtros} onChange={setFiltros} />
      <button
        type="button"
        onClick={() => {
          setFormulario(vehiculoInicial);
          setError("");
          setMensaje("");
          setMostrarFormulario(true);
        }}
      >
        Agregar Vehiculo
      </button>
      {error && <p className="mensaje-error">{error}</p>}
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}
      {mostrarFormulario && (
        <form className="formulario-datos" onSubmit={agregarVehiculo}>
          <label>
            Marca
            <input
              name="marca"
              value={formulario.marca}
              onChange={cambiarCampo}
              required
            />
          </label>
          <label>
            Modelo
            <input
              name="modelo"
              value={formulario.modelo}
              onChange={cambiarCampo}
              required
            />
          </label>
          <label>
            Patente
            <input
              name="patente"
              value={formulario.patente}
              onChange={cambiarCampo}
              required
            />
          </label>
          <label>
            Año
            <input
              name="anio"
              type="number"
              min="2000"
              max={new Date().getFullYear() + 1}
              value={formulario.anio}
              onChange={cambiarCampo}
              required
            />
          </label>
          <label>
            Capacidad de carga
            <input
              name="capacidad_carga"
              type="number"
              min="0"
              step="0.01"
              value={formulario.capacidad_carga}
              onChange={cambiarCampo}
              required
            />
          </label>
          <div className="acciones-formulario">
            <button type="submit">Guardar</button>
            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}
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
          {vehiculos.map((vehiculo) => (
            <tr key={vehiculo.id}>
              <td>{vehiculo.id}</td>
              <td>{vehiculo.marca}</td>
              <td>{vehiculo.modelo}</td>
              <td>{vehiculo.patente}</td>
              <td>{vehiculo.anio}</td>
              <td>{vehiculo.capacidad_carga}</td>
              <td>
                <button>Editar</button>
                <button>Eliminar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Vehiculos;
