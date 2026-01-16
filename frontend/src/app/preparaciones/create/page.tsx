'use client';

import { useEffect, useState } from 'react';
import withAuth from '../../../components/auth/withAuth';
import api from '../../../services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Materia {
  id: number;
  tipo: string;
  lote: string;
}

const CreatePreparacionPage = () => {
  const [materiaPrima, setMateriaPrima] = useState<string>('');
  const [tipoProceso, setTipoProceso] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [cantidadProcesada, setCantidadProcesada] = useState<number>(0);
  const [porcentajeMezcla, setPorcentajeMezcla] = useState<number | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [calidadResultado, setCalidadResultado] = useState<string | null>(null);
  // fecha_inicio and usuario_preparador are handled by the backend
  
  const [materias, setMaterias] = useState<Materia[]>([]); // For Materia Prima dropdown
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch Materias for dropdown
  useEffect(() => {
    const fetchMaterias = async () => {
      try {
        const response = await api.get('/api/materias/');
        setMaterias(response.data);
      } catch (err) {
        console.error('Error fetching materias:', err);
        setError('Error al cargar opciones de Materia Prima.');
      }
    };
    fetchMaterias();
  }, []);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/preparaciones/', {
        materia_prima: materiaPrima,
        tipo_proceso: tipoProceso,
        estado: estado,
        cantidad_procesada: cantidadProcesada,
        porcentaje_mezcla: porcentajeMezcla,
        observaciones: observaciones,
        calidad_resultado: calidadResultado,
        // fecha_inicio and usuario_preparador are automatically set by backend
      });
      alert('Preparación creada exitosamente!');
      router.push('/preparaciones'); // Redirect to preparaciones list
    } catch (err: any) {
      setError('Error al crear preparación. Verifique los datos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Crear Nueva Preparación de Materia Prima</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {/* Materia Prima */}
        <div className="mb-4">
          <label htmlFor="materiaPrima" className="block text-gray-700 text-sm font-bold mb-2">
            Materia Prima:
          </label>
          <select
            id="materiaPrima"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={materiaPrima}
            onChange={(e) => setMateriaPrima(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Seleccione una materia prima</option>
            {materias.map((m) => (
              <option key={m.id} value={m.id}>
                {m.tipo} (Lote: {m.lote})
              </option>
            ))}
          </select>
        </div>

        {/* Tipo de Proceso */}
        <div className="mb-4">
          <label htmlFor="tipoProceso" className="block text-gray-700 text-sm font-bold mb-2">
            Tipo de Proceso:
          </label>
          <select
            id="tipoProceso"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={tipoProceso}
            onChange={(e) => setTipoProceso(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Seleccione un tipo de proceso</option>
            <option value="limpieza">Limpieza</option>
            <option value="apertura">Apertura</option>
            <option value="mezclado">Mezclado</option>
            <option value="ajuste_proporciones">Ajuste de Proporciones</option>
          </select>
        </div>

        {/* Estado */}
        <div className="mb-4">
          <label htmlFor="estado" className="block text-gray-700 text-sm font-bold mb-2">
            Estado:
          </label>
          <select
            id="estado"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={estado}
            onChange={(e) => setEstado(e.target.value)}
            required
            disabled={loading}
          >
            <option value="pendiente">Pendiente</option>
            <option value="en_proceso">En Proceso</option>
            <option value="completada">Completada</option>
            <option value="rechazada">Rechazada</option>
          </select>
        </div>

        {/* Cantidad Procesada */}
        <div className="mb-4">
          <label htmlFor="cantidadProcesada" className="block text-gray-700 text-sm font-bold mb-2">
            Cantidad Procesada (kg):
          </label>
          <input
            type="number"
            id="cantidadProcesada"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={cantidadProcesada}
            onChange={(e) => setCantidadProcesada(Number(e.target.value))}
            required
            disabled={loading}
          />
        </div>

        {/* Porcentaje Mezcla */}
        <div className="mb-4">
          <label htmlFor="porcentajeMezcla" className="block text-gray-700 text-sm font-bold mb-2">
            Porcentaje en Mezcla Final (%):
          </label>
          <input
            type="number"
            id="porcentajeMezcla"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={porcentajeMezcla || ''}
            onChange={(e) => setPorcentajeMezcla(e.target.value ? Number(e.target.value) : null)}
            disabled={loading}
          />
        </div>

        {/* Observaciones */}
        <div className="mb-6">
          <label htmlFor="observaciones" className="block text-gray-700 text-sm font-bold mb-2">
            Observaciones:
          </label>
          <textarea
            id="observaciones"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={observaciones}
            onChange={(e) => setObservaciones(e.target.value)}
            rows={3}
            disabled={loading}
          ></textarea>
        </div>

        {/* Calidad Resultado */}
        <div className="mb-4">
          <label htmlFor="calidadResultado" className="block text-gray-700 text-sm font-bold mb-2">
            Calidad del Resultado:
          </label>
          <select
            id="calidadResultado"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={calidadResultado || ''}
            onChange={(e) => setCalidadResultado(e.target.value ? e.target.value : null)}
            disabled={loading}
          >
            <option value="">Seleccione la calidad</option>
            <option value="excelente">Excelente</option>
            <option value="buena">Buena</option>
            <option value="regular">Regular</option>
            <option value="deficiente">Deficiente</option>
          </select>
        </div>


        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            disabled={loading}
          >
            {loading ? 'Creando...' : 'Crear Preparación'}
          </button>
          <Link href="/preparaciones" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default withAuth(CreatePreparacionPage);
