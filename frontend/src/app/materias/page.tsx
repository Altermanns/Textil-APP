'use client';

import { useEffect, useState } from 'react';
import withAuth from '../../components/auth/withAuth';
import api from '../../services/api';
import Link from 'next/link';

interface Materia {
  id: number;
  tipo: string;
  cantidad: number;
  unidad_medida: string;
  lote: string;
  fecha_ingreso: string; // Assuming ISO date string
  usuario_registro: string; // Username of the registering user
}

const MateriasListPage = () => {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await api.get('/api/materias/');
        setMaterias(response.data);
      } catch (err: any) {
        setError('Error al cargar materias primas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMaterias();
  }, []);

  if (loading) {
    return <div>Cargando materias primas...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Materias Primas</h1>

      <div className="mb-4">
        <Link href="/materias/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Registrar Nueva Materia Prima
        </Link>
      </div>

      {materias.length === 0 ? (
        <p>No hay materias primas registradas.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cantidad
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Lote
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fecha Ingreso
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Registrado por
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {materias.map((materia) => (
                <tr key={materia.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {materia.id}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {materia.tipo}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {materia.cantidad}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {materia.unidad_medida}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {materia.lote}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(materia.fecha_ingreso).toLocaleDateString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {materia.usuario_registro}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <Link href={`/materias/${materia.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-3">
                      Editar
                    </Link>
                    {/* <button className="text-red-600 hover:text-red-900">Eliminar</button> */}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default withAuth(MateriasListPage);
