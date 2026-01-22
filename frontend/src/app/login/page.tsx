"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext"; // Import useAuth
import api from "../../services/api";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated, fetchUser, user } = useAuth(); // Get login, fetchUser and user
  const [success, setSuccess] = useState("");

  // Redirect if already authenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push('/dashboard');
  //   }
  // }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Submit a classic HTML form to the Django login endpoint so the browser
    // performs the navigation and stores the session cookie for the
    // backend origin. The backend will redirect to the admin dashboard.
    try {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "http://localhost:8000/auth/login/";

      const u = document.createElement("input");
      u.type = "hidden";
      u.name = "username";
      u.value = username;
      form.appendChild(u);

      const p = document.createElement("input");
      p.type = "hidden";
      p.name = "password";
      p.value = password;
      form.appendChild(p);

      // Ask backend to redirect to admin dashboard after login
      const n = document.createElement("input");
      n.type = "hidden";
      n.name = "next";
      n.value = "/dashboard/admin/";
      form.appendChild(n);

      document.body.appendChild(form);
      form.submit();
      // navigation will happen, no further client-side handling
    } catch (err) {
      setError("No se pudo iniciar sesión. Intenta de nuevo.");
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div
        className="card shadow-lg p-8 bg-white rounded-lg"
        style={{ maxWidth: "420px", width: "100%" }}
      >
        <h3 className="text-2xl font-bold mb-2">Bienvenido de nuevo</h3>
        <p className="text-gray-500 mb-6">
          Ingresa con tu cuenta para acceder al panel
        </p>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {success && (
          <div
            className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4"
            role="status"
          >
            <span className="block sm:inline">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label
              htmlFor="username"
              className="block text-gray-700 font-semibold mb-2"
            >
              Usuario o correo
            </label>
            <input
              id="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="username"
              placeholder="usuario o correo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-700 font-semibold mb-2"
            >
              Contraseña
            </label>
            <input
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              name="password"
              placeholder="contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-between items-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? "Entrando..." : "Entrar"}
            </button>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Volver
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
