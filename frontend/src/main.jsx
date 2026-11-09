import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.jsx";
import Inicio from "./Inicio.jsx";
import Login from "./Login.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route index element={<Inicio />} />
        <Route path="login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
