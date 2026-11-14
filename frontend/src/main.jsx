import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Inicio from "./Inicio.jsx";
import Login from "./Login.jsx";
import Layout from "./Layout.jsx";
import Vehiculos from "./Vehiculos.jsx";
import Conductores from "./Conductores.jsx";
import Historial from "./Historial.jsx";

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
