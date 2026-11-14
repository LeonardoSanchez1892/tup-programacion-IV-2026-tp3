import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import { AuthProvider } from "./Auth.jsx";
import Conductores from "./Conductores.jsx";
import Historial from "./Historial.jsx";
import "./index.css";
import Inicio from "./Inicio.jsx";
import { Layout } from "./Layout.jsx";
import { Login } from "./Login.jsx";
import Vehiculos from "./Vehiculos.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Inicio />} />
            <Route path="login" element={<Login />} />
            <Route path="vehiculos" element={<Vehiculos />} />
            <Route path="conductores" element={<Conductores />} />
            <Route path="historial" element={<Historial />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
