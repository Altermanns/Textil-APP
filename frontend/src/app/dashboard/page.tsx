'use client';

import withAuth from '../../components/auth/withAuth';
import { useAuth } from '../../context/AuthContext';

const DashboardPage = () => {
  const { user, logout } = useAuth();

  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="mt-4">
        Bienvenido, {user?.first_name || user?.username}!
      </p>
      <div className="mt-6 p-4 border rounded-lg bg-gray-100">
        <h2 className="font-semibold">Tu Información:</h2>
        <p><strong>Usuario:</strong> {user?.username}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Rol:</strong> {user?.profile?.role}</p>
      </div>

      <button
        onClick={logout}
        className="mt-6 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </div>
  );
};

export default withAuth(DashboardPage);
