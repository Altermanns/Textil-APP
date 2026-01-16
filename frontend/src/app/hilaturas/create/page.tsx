'use client';

import { useEffect, useState } from 'react';
import withAuth from '../../../components/auth/withAuth';
import api from '../../../services/api';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PreparacionMateria {
  id: number;
  tipo_proceso: string;
  materia_prima_display: string;
}

const CreateHilaturaPage = () => {
  const [preparacionOrigen, setPreparacionOrigen] = useState<string>('');
  const [etapa, setEtapa] = useState('');
  const [estado, setEstado] = useState('pendiente');
  const [cantidadFibraEntrada, setCantidadFibraEntrada] = useState<number>(0);
  const [cantidadHiloSalida, setCantidadHiloSalida] = useState<number>(0);
  const [tituloHilo, setTituloHilo] = useState('');
  const [torsion, setTorsion] = useState<number | null>(null);
  const [resistencia, setResistencia] = useState<number | null>(null);
  const [observaciones, setObservaciones] = useState('');
  const [calidadResultado, setCalidadResultado] = useState<string | null>(null);
  // fecha_inicio and usuario_operador are handled by the backend
  
  const [preparaciones, setPreparaciones] = useState<PreparacionMateria[]>([]); // For PreparacionMateria dropdown
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Fetch Preparaciones for dropdown
  useEffect(() => {
    const fetchPreparaciones = async () => {
      try {
        const response = await api.get('/api/preparaciones/');
        setPreparaciones(response.data);
      } catch (err) {
        console.error('Error fetching preparaciones:', err);
        setError('Error al cargar opciones de Preparación de Materia.');
      }
    };
    fetchPreparaciones();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/api/hilaturas/', {
        preparacion_origen: preparacionOrigen,
        etapa: etapa,
        estado: estado,
        cantidad_fibra_entrada: cantidadFibraEntrada,
        cantidad_hilo_salida: cantidadHiloSalida,
        titulo_hilo: tituloHilo,
        torsion: torsion,
        resistencia: resistencia,
        observaciones: observaciones,
        calidad_resultado: calidadResultado,
        // fecha_inicio and usuario_operador are automatically set by backend
      });
      alert('Proceso de Hilatura registrado exitosamente!');
      router.push('/hilaturas'); // Redirect to hilaturas list
    } catch (err: any) {
      setError('Error al registrar proceso de hilatura. Verifique los datos.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Registrar Nuevo Proceso de Hilatura</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6">
        {/* Preparacion Origen */}
        <div className="mb-4">
          <label htmlFor="preparacionOrigen" className="block text-gray-700 text-sm font-bold mb-2">
            Preparación de Origen:
          </label>
          <select
            id="preparacionOrigen"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={preparacionOrigen}
            onChange={(e) => setPreparacionOrigen(e.target.value)}
            // required - can be null
            disabled={loading}
          >
            <option value="">Seleccione una preparación de origen (opcional)</option>
            {preparaciones.map((p) => (
              <option key={p.id} value={p.id}>
                {p.tipo_proceso} ({p.materia_prima_display})
              </option>
            ))}
          </select>
        </div>

        {/* Etapa */}
        <div className="mb-4">
          <label htmlFor="etapa" className="block text-gray-700 text-sm font-bold mb-2">
            Etapa:
          </label>
          <select
            id="etapa"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={etapa}
            onChange={(e) => setEtapa(e.target.value)}
            required
            disabled={loading}
          >
            <option value="">Seleccione una etapa</option>
            <option value="cardado">Cardado</option>
            <option value="peinado">Peinado</option>
            <option value="hilado">Hilado</option>
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

        {/* Cantidad Fibra Entrada */}
        <div className="mb-4">
          <label htmlFor="cantidadFibraEntrada" className="block text-gray-700 text-sm font-bold mb-2">
            Cantidad de Fibra de Entrada (kg):
          </label>
          <input
            type="number"
            id="cantidadFibraEntrada"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={cantidadFibraEntrada}
            onChange={(e) => setCantidadFibraEntrada(Number(e.target.value))}
            required
            disabled={loading}
          />
        </div>

        {/* Cantidad Hilo Salida */}
        <div className="mb-4">
          <label htmlFor="cantidadHiloSalida" className="block text-gray-700 text-sm font-bold mb-2">
            Cantidad de Hilo Producido (kg):
          </label>
          <input
            type="number"
            id="cantidadHiloSalida"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={cantidadHiloSalida}
            onChange={(e) => setCantidadHiloSalida(Number(e.target.value))}
            required
            disabled={loading}
          />
        </div>

        {/* Titulo Hilo */}
        <div className="mb-4">
          <label htmlFor="tituloHilo" className="block text-gray-700 text-sm font-bold mb-2">
            Título del Hilo:
          </label>
          <input
            type="text"
            id="tituloHilo"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={tituloHilo}
            onChange={(e) => setTituloHilo(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Torsion */}
        <div className="mb-4">
          <label htmlFor="torsion" className="block text-gray-700 text-sm font-bold mb-2">
            Torsión (TPM):
          </label>
          <input
            type="number"
            id="torsion"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={torsion || ''}
            onChange={(e) => setTorsion(e.target.value ? Number(e.target.value) : null)}
            disabled={loading}
          />
        </div>

        {/* Resistencia */}
        <div className="mb-4">
          <label htmlFor="resistencia" className="block text-gray-700 text-sm font-bold mb-2">
            Resistencia (cN/tex):
          </label>
          <input
            type="number"
            id="resistencia"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={resistencia || ''}
            onChange={(e) => setResistencia(e.target.value ? Number(e.target.value) : null)}
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
            {loading ? 'Registrando...' : 'Registrar Proceso de Hilatura'}
          </button>
          <Link href="/hilaturas" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Cancelar
          </Link>
        </div>
      </form>
    </div>
  );
};

export default withAuth(CreateHilaturaPage);
