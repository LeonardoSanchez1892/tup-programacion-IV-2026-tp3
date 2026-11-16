import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "./Auth";
import "./Login.css";

export function Login() {
  const { error, login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(email, password);
    if (res.success) {
      navigate("/");
    }
  };

  return (
    <div className="login-form">
      <h2>Ingresar</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Usuario:</label>
        <input
          name="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label htmlFor="password">Contraseña:</label>
        <input
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {error && <p style={{ color: "red" }}>{error}</p>}

        <div>
          <button type="submit">Ingresar</button>
          <Link to="/">
            <button>Volver</button>
          </Link>
        </div>
      </form>
    </div>
  );
}
