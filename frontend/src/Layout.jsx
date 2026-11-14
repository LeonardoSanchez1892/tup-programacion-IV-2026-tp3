import { Link, Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "./Auth";

export function Layout() {
  const { isAuthenticated, esAdmin, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  return (
    <main>
      <nav>
        <h1>Logo</h1>
        <ul>
          <li className={pathname === "/" ? "active" : ""}>
            <Link to="/">Inicio</Link>
          </li>
          {isAuthenticated ? (
            <>
              <li className={pathname.startsWith("/vehiculos") ? "active" : ""}>
                <Link to="/vehiculos">Vehiculos</Link>
              </li>
              {esAdmin && (
                <li
                  className={
                    pathname.startsWith("/conductores") ? "active" : ""
                  }
                >
                  <Link to="/conductores">Conductores</Link>
                </li>
              )}
              <li className={pathname.startsWith("/historial") ? "active" : ""}>
                <Link to="/historial">Historial</Link>
              </li>
              <button
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Salir
              </button>
            </>
          ) : (
            <li>
              <Link to="/login">Ingresar</Link>
            </li>
          )}
        </ul>
      </nav>
      <div className="contenedor">
      <Outlet />
      </div>
    </main>
  );
}
