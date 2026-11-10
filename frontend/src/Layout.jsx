import { Outlet, Link } from "react-router";
import "./Layout.css";

const Layout = () => {
  return (
    <>
      <div>
        <nav>
          <h1>Logo</h1>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/vehiculos">Vehiculos</Link>
            </li>
            <li>
              <Link to="/conductores">Conductores</Link>
            </li>
            <li>
              <Link to="/historial">Historial</Link>
            </li>
          </ul>
        </nav>
        <main>
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default Layout;
