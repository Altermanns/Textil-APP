'use client';

import { useState } from 'react';
import withAuth from '../../../components/auth/withAuth';
import api from '../../../services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const CreateMateriaPage = () => {
  const [tipo, setTipo] = useState('');
  const [cantidad, setCantidad] = useState<number>(0);
  const [unidadMedida, setUnidadMedida] = useState('');
  const [lote, setLote] = useState('');
  const [fechaIngreso, setFechaIngreso] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/materias/', {
        tipo,
        cantidad,
        unidad_medida: unidadMedida,
        lote,
        fecha_ingreso: fechaIngreso,
      });
      alert('Materia prima registrada exitosamente!');
      router.push('/materias'); // Redirect to materias list
    } catch (err: any) {
      setError('Error al registrar materia prima. Verifique los datos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Registrar Nueva Materia Prima</h1>

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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
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
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Registrando...' : 'Registrar Materia Prima'}
          </button>
          <Link href="/materias" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default withAuth(CreateMateriaPage);
