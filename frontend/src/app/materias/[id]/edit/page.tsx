'use client';

import { useEffect, useState } from 'react';
import withAuth from '../../../../components/auth/withAuth';
import api from '../../../../services/api';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';

interface Materia {
  id: number;
  tipo: string;
  cantidad: number;
  unidad_medida: string;
  lote: string;
  fecha_ingreso: string; // Assuming ISO date string
  usuario_registro: string; // Username of the registering user
}

const EditMateriaPage = () => {
  const [materia, setMateria] = useState<Materia | null>(null);
  const [tipo, setTipo] = useState('');
  const [cantidad, setCantidad] = useState<number>(0);
  const [unidadMedida, setUnidadMedida] = useState('');
  const [lote, setLote] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const materiaId = params.id as string;

  useEffect(() => {
    const fetchMateria = async () => {
      try {
        const response = await api.get(`/api/materias/${materiaId}/`);
        const materiaData: Materia = response.data;
        setMateria(materiaData);
        setTipo(materiaData.tipo);
        setCantidad(materiaData.cantidad);
        setUnidadMedida(materiaData.unidad_medida);
        setLote(materiaData.lote);
        setFechaIngreso(materiaData.fecha_ingreso);
      } catch (err: any) {
        setError('Error al cargar datos de la materia prima.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (materiaId) {
      fetchMateria();
    }
  }, [materiaId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await api.put(`/api/materias/${materiaId}/`, {
        tipo,
        cantidad,
        unidad_medida: unidadMedida,
        lote,
        fecha_ingreso: fechaIngreso,
      });
      alert('Materia prima actualizada exitosamente!');
      router.push('/materias'); // Redirect to materias list
    } catch (err: any) {
      setError('Error al actualizar materia prima. Verifique los datos.');
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <div>Cargando materia prima...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!materia) {
    return <div>Materia prima no encontrada.</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Editar Materia Prima: {materia.tipo}</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label htmlFor="tipo" className="block text-gray-700 text-sm font-bold mb-2">
            Tipo:
          </label>
          <input
            type="text"
            id="tipo"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={tipo}
            onChange={(e) => setTipo(e.target.value)}
            required
            disabled={submitting}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="cantidad" className="block text-gray-700 text-sm font-bold mb-2">
            Cantidad:
          </label>
          <input
            type="number"
            id="cantidad"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={cantidad}
            onChange={(e) => setCantidad(Number(e.target.value))}
            required
            disabled={submitting}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="unidadMedida" className="block text-gray-700 text-sm font-bold mb-2">
            Unidad de Medida:
          </label>
          <input
            type="text"
            id="unidadMedida"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={unidadMedida}
            onChange={(e) => setUnidadMedida(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="mb-4">
          <label htmlFor="lote" className="block text-gray-700 text-sm font-bold mb-2">
            Lote:
          </label>
          <input
            type="text"
            id="lote"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={lote}
            onChange={(e) => setLote(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="mb-6">
          <label htmlFor="fechaIngreso" className="block text-gray-700 text-sm font-bold mb-2">
            Fecha de Ingreso:
          </label>
          <input
            type="date"
            id="fechaIngreso"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={fechaIngreso}
            onChange={(e) => setFechaIngreso(e.target.value)}
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
            {submitting ? 'Actualizando...' : 'Actualizar Materia Prima'}
          </button>
          <Link href="/materias" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default withAuth(EditMateriaPage);
