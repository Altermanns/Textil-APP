'use client';

import { useEffect, useState } from 'react';
import withAuth from '../../components/auth/withAuth';
import api from '../../services/api';
import Link from 'next/link';

interface Hilatura {
  id: number;
  preparacion_origen: number | null; // ID of PreparacionMateria
  preparacion_origen_display: string | null; // __str__ of PreparacionMateria
  etapa: string;
  estado: string;
  cantidad_fibra_entrada: number;
  cantidad_hilo_salida: number;
  titulo_hilo: string;
  torsion: number | null;
  resistencia: number | null;
  observaciones: string;
  calidad_resultado: string | null;
  fecha_inicio: string; // Assuming ISO date string
  fecha_completado: string | null;
  usuario_operador: number | null; // ID of User
  usuario_operador_display: string | null; // Username of the operador
}

const HilaturasListPage = () => {
  const [hilaturas, setHilaturas] = useState<Hilatura[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHilaturas = async () => {
      try {
        const response = await api.get('/api/hilaturas/');
        setHilaturas(response.data);
      } catch (err: any) {
        setError('Error al cargar hilaturas.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchHilaturas();
  }, []);

  if (loading) {
    return <div>Cargando hilaturas...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Gestión de Procesos de Hilatura</h1>

      <div className="mb-4">
        <Link href="/hilaturas/create" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Registrar Nuevo Proceso de Hilatura
        </Link>
      </div>

      {hilaturas.length === 0 ? (
        <p>No hay procesos de hilatura registrados.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-md rounded-lg">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Etapa
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Fibra Entrada
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Hilo Salida
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Operador
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              {hilaturas.map((hilatura) => (
                <tr key={hilatura.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {hilatura.id}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {hilatura.etapa}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {hilatura.estado}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {hilatura.cantidad_fibra_entrada} kg
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {hilatura.cantidad_hilo_salida} kg
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {hilatura.usuario_operador_display || 'N/A'}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <Link href={`/hilaturas/${hilatura.id}/edit`} className="text-blue-600 hover:text-blue-900 mr-3">
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

export default withAuth(HilaturasListPage);
