'use client';

import { useEffect, useState } from 'react';
import withAuth from '../../components/auth/withAuth';
import api from '../../services/api';
import Link from 'next/link';

interface PreparacionMateria {
  id: number;
  materia_prima: number; // ID of Materia
  materia_prima_display: string; // __str__ of Materia
  tipo_proceso: string;
  estado: string;
  cantidad_procesada: number;
  porcentaje_mezcla: number | null;
  observaciones: string;
  calidad_resultado: string | null;
  fecha_inicio: string; // Assuming ISO date string
  fecha_completado: string | null;
  usuario_preparador: number | null; // ID of User
  usuario_preparador_display: string | null; // Username of the preparador
}

const PreparacionesListPage = () => {
  const [preparaciones, setPreparaciones] = useState<PreparacionMateria[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPreparaciones = async () => {
      try {
        const response = await api.get('/api/preparaciones/');
        setPreparaciones(response.data);
      } catch (err: any) {
        setError('Error al cargar preparaciones.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreparaciones();
  }, []);

  if (loading) {
    return <div>Cargando preparaciones...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Preparaciones de Materia Prima</h1>

      <div className="mb-4">
        <Link href="/preparaciones/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Crear Nueva Preparación
        </Link>
      </div>

      {preparaciones.length === 0 ? (
        <p>No hay preparaciones registradas.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Materia Prima
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tipo Proceso
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Cant. Procesada
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Preparador
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {preparaciones.map((preparacion) => (
                <tr key={preparacion.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {preparacion.id}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {preparacion.materia_prima_display}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {preparacion.tipo_proceso}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {preparacion.estado}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {preparacion.cantidad_procesada}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {preparacion.usuario_preparador_display || 'N/A'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <Link href={`/preparaciones/${preparacion.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-3">
                      Editar
                    </Link>
                    {/* Add View Details link */}
                    <Link href={`/preparaciones/${preparacion.id}`} className="text-green-600 hover:text-green-900 mr-3">
                      Ver
                    </Link>
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

export default withAuth(PreparacionesListPage);
