import { useEffect, useState } from "react";
import "./Vehiculos.css";
import { useAuth } from "./Auth.jsx";

const conductorInicial = {
  nombre: "",
  apellido: "",
  numero_documento: "",
  numero_licencia: "",
  fecha_alta_licencia: "",
  fecha_vencimiento_licencia: "",
};

const Conductores = () => {
  const [conductores, setConductores] = useState([]);
  const [formulario, setFormulario] = useState(conductorInicial);
  const [conductorEditando, setConductorEditando] = useState(null);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [recarga, setRecarga] = useState(0);
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState("");
  const { fetchAuth } = useAuth();

  useEffect(() => {
    let ignorar = false;
    const cargarConductores = async () => {
      try {
        const response = await fetchAuth("http://localhost:3000/conductores");
        if (!response.ok) {
          throw new Error("No se pudieron cargar los conductores.");
        }
        const datos = await response.json();
        if (!ignorar) {
          setConductores(datos);
          setError("");
        }
      } catch (e) {
        if (!ignorar) {
          setError(e.message);
        }
      }
    };

    cargarConductores();
    return () => {
      ignorar = true;
    };
  }, [fetchAuth, recarga]);

  const cambiarCampo = (e) => {
    setFormulario({ ...formulario, [e.target.name]: e.target.value });
  };

  const abrirFormulario = (conductor = null) => {
    setError("");
    setMensaje("");
    setConductorEditando(conductor);
    setFormulario(
      conductor
        ? {
            nombre: conductor.nombre,
            apellido: conductor.apellido,
            numero_documento: conductor.numero_documento,
            numero_licencia: conductor.numero_licencia,
            fecha_alta_licencia: String(conductor.fecha_alta_licencia).slice(
              0,
              10,
            ),
            fecha_vencimiento_licencia: String(
              conductor.fecha_vencimiento_licencia,
            ).slice(0, 10),
          }
        : conductorInicial,
    );
    setMostrarFormulario(true);
  };

  const guardarConductor = async (e) => {
    e.preventDefault();
    setError("");
    setMensaje("");

    const url = conductorEditando
      ? `http://localhost:3000/conductores/${conductorEditando.id}`
      : "http://localhost:3000/conductores";

    try {
      const response = await fetchAuth(url, {
        method: conductorEditando ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formulario),
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      setMostrarFormulario(false);
      setConductorEditando(null);
      setFormulario(conductorInicial);
      setMensaje(
        conductorEditando
          ? "Conductor actualizado correctamente."
          : "Conductor agregado correctamente.",
      );
      setRecarga((actual) => actual + 1);
    } catch (e) {
      setError(e.message || "No se pudo guardar el conductor.");
    }
  };

  const eliminarConductor = async (conductor) => {
    if (
      !window.confirm(
        `¿Eliminar a ${conductor.nombre} ${conductor.apellido}?`,
      )
    ) {
      return;
    }

    setError("");
    setMensaje("");
    try {
      const response = await fetchAuth(
        `http://localhost:3000/conductores/${conductor.id}`,
        { method: "DELETE" },
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      setMensaje("Conductor eliminado correctamente.");
      setRecarga((actual) => actual + 1);
    } catch (e) {
      setError(e.message || "No se pudo eliminar el conductor.");
    }
  };

  return (
    <>
      <h1>Conductores</h1>
      <button type="button" onClick={() => abrirFormulario()}>
        Agregar conductor
      </button>

      {error && <p className="mensaje-error">{error}</p>}
      {mensaje && <p className="mensaje-exito">{mensaje}</p>}

      {mostrarFormulario && (
        <form className="formulario-datos" onSubmit={guardarConductor}>
          <label>
            Nombre
            <input
              name="nombre"
              value={formulario.nombre}
              onChange={cambiarCampo}
              required
            />
          </label>
          <label>
            Apellido
            <input
              name="apellido"
              value={formulario.apellido}
              onChange={cambiarCampo}
              required
            />
          </label>
          <label>
            Número de documento
            <input
              name="numero_documento"
              value={formulario.numero_documento}
              onChange={cambiarCampo}
              required
            />
          </label>
          <label>
            Número de licencia
            <input
              name="numero_licencia"
              value={formulario.numero_licencia}
              onChange={cambiarCampo}
              required
            />
          </label>
          <label>
            Fecha de alta de licencia
            <input
              name="fecha_alta_licencia"
              type="date"
              value={formulario.fecha_alta_licencia}
              onChange={cambiarCampo}
              required
            />
          </label>
          <label>
            Fecha de vencimiento de licencia
            <input
              name="fecha_vencimiento_licencia"
              type="date"
              value={formulario.fecha_vencimiento_licencia}
              onChange={cambiarCampo}
              required
            />
          </label>
          <div className="acciones-formulario">
            <button type="submit">
              {conductorEditando ? "Guardar cambios" : "Guardar"}
            </button>
            <button
              type="button"
              onClick={() => setMostrarFormulario(false)}
            >
              Cancelar
            </button>
          </div>
        </form>
      )}

      <table className="tabla-datos">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Num. documento</th>
            <th>Num. licencia</th>
            <th>Alta de licencia</th>
            <th>Vencimiento de licencia</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {conductores.map((conductor) => (
            <tr key={conductor.id}>
              <td>{conductor.id}</td>
              <td>{conductor.nombre}</td>
              <td>{conductor.apellido}</td>
              <td>{conductor.numero_documento}</td>
              <td>{conductor.numero_licencia}</td>
              <td>{conductor.fecha_alta_licencia}</td>
              <td>{conductor.fecha_vencimiento_licencia}</td>
              <td className="acciones-tabla">
                <button type="button" onClick={() => abrirFormulario(conductor)}>
                  Editar
                </button>
                <button
                  type="button"
                  onClick={() => eliminarConductor(conductor)}
                >
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Conductores;
