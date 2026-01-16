'use client';

import { useEffect, useState } from 'react';
import withAuth from '../../../../components/auth/withAuth';
import api from '../../../../services/api';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface PreparacionMateria {
  id: number;
  tipo_proceso: string;
  materia_prima_display: string;
}

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

const HilaturaDetailPage = () => {
  const [hilatura, setHilatura] = useState<Hilatura | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const hilaturaId = params.id as string;

  useEffect(() => {
    const fetchHilatura = async () => {
      try {
        const response = await api.get(`/api/hilaturas/${hilaturaId}/`);
        setHilatura(response.data);
      } catch (err: any) {
        setError('Error al cargar datos del proceso de hilatura.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (hilaturaId) {
      fetchHilatura();
    }
  }, [hilaturaId]);

  if (loading) {
    return <div>Cargando proceso de hilatura...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!hilatura) {
    return <div>Proceso de hilatura no encontrado.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-4">Detalles de Hilatura: {hilatura.id}</h1>
      
      <div className="mb-4">
        <p><strong>Preparación de Origen:</strong> {hilatura.preparacion_origen_display || 'N/A'}</p>
        <p><strong>Etapa:</strong> {hilatura.etapa}</p>
        <p><strong>Estado:</strong> {hilatura.estado}</p>
        <p><strong>Cantidad de Fibra de Entrada:</strong> {hilatura.cantidad_fibra_entrada} kg</p>
        <p><strong>Cantidad de Hilo Producido:</strong> {hilatura.cantidad_hilo_salida} kg</p>
        <p><strong>Título del Hilo:</strong> {hilatura.titulo_hilo || 'N/A'}</p>
        <p><strong>Torsión:</strong> {hilatura.torsion !== null ? `${hilatura.torsion} TPM` : 'N/A'}</p>
        <p><strong>Resistencia:</strong> {hilatura.resistencia !== null ? `${hilatura.resistencia} cN/tex` : 'N/A'}</p>
        <p><strong>Observaciones:</strong> {hilatura.observaciones || 'Sin observaciones'}</p>
        <p><strong>Calidad del Resultado:</strong> {hilatura.calidad_resultado || 'N/A'}</p>
        <p><strong>Fecha Inicio:</strong> {new Date(hilatura.fecha_inicio).toLocaleString()}</p>
        <p><strong>Fecha Completado:</strong> {hilatura.fecha_completado ? new Date(hilatura.fecha_completado).toLocaleString() : 'Pendiente'}</p>
        <p><strong>Operador:</strong> {hilatura.usuario_operador_display || 'N/A'}</p>
      </div>

      <div className="flex space-x-4">
        <Link href={`/hilaturas/${hilatura.id}/edit`} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Editar Proceso de Hilatura
        </Link>
        <Link href="/hilaturas" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
          Volver a la Lista
        </Link>
      </div>
    </div>
  );
};

export default withAuth(HilaturaDetailPage);
