export function VehiculosFiltros({ filtros, onChange }) {
  return (
    <>
      <h2>Filtros</h2>
      <label htmlFor="filtroMarca">Marca:</label>
      <input
        type="text"
        id="filtroMarca"
        value={filtros.marca}
        onChange={(e) => onChange((f) => ({ ...f, marca: e.target.value }))}
      />
      <label htmlFor="filtroModelo">Modelo:</label>
      <input
        type="number"
        id="filtroModelo"
        min={0}
        step={1}
        value={filtros.modelo}
        onChange={(e) =>
          onChange((f) => ({
            ...f,
            modelo: e.target.value === "" ? "" : Number(e.target.value),
          }))
        }
      />
      <label htmlFor="filtroPatente">Patente:</label>
      <input
        type="text"
        id="filtroPatente"
        value={filtros.patente}
        onChange={(e) => onChange((f) => ({ ...f, patente: e.target.value }))}
      />
    </>
  );
}
