"use client";

import { useEffect, useState } from "react";
import withAuth from "../../../../components/auth/withAuth";
import api from "../../../../services/api";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  email: string;
  // profile: {
  //   role: string;
  // };
}

const EditUserPage = () => {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const userId = params.id as string;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get(`/api/users/${userId}/`);
        const userData: User = response.data;
        setUser(userData);
        setUsername(userData.username);
        setFirstName(userData.first_name);
        setLastName(userData.last_name);
        setEmail(userData.email);
      } catch (err: any) {
        setError("Error al cargar datos del usuario.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await api.put(`/api/users/${userId}/`, {
        username,
        first_name: firstName,
        last_name: lastName,
        email,
      });
      alert("Usuario actualizado exitosamente!");
      router.push("/users"); // Redirect to users list
    } catch (err: any) {
      setError("Error al actualizar usuario. Verifique los datos.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Cargando usuario...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!user) {
    return <div>Usuario no encontrado.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">
        Editar Usuario: {user.username}
      </h1>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-lg p-6"
      >
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Nombre de Usuario:
          </label>
          <input
            type="text"
            id="username"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="firstName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Nombre:
          </label>
          <input
            type="text"
            id="firstName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="lastName"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Apellido:
          </label>
          <input
            type="text"
            id="lastName"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="email"
            className="block text-gray-700 text-sm font-bold mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={submitting}
          >
            {submitting ? "Actualizando..." : "Actualizar Usuario"}
          </button>
          <Link
            href="/users"
            className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default withAuth(EditUserPage);
