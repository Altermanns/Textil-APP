"use client";

import { useEffect, useState } from "react";
import withAuth from "../../../components/auth/withAuth";
import api from "../../../services/api";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

interface Materia {
  id: number;
  tipo: string;
  lote: string;
}

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

const PreparacionDetailPage = () => {
  const [preparacion, setPreparacion] = useState<PreparacionMateria | null>(
    null,
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();
  const preparacionId = params.id as string;

  useEffect(() => {
    const fetchPreparacion = async () => {
      try {
        const response = await api.get(`/api/preparaciones/${preparacionId}/`);
        setPreparacion(response.data);
      } catch (err: any) {
        setError("Error al cargar datos de la preparación.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (preparacionId) {
      fetchPreparacion();
    }
  }, [preparacionId]);

  if (loading) {
    return <div>Cargando preparación...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (!preparacion) {
    return <div>Preparación no encontrada.</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h1 className="text-3xl font-bold mb-4">
        Detalles de Preparación: {preparacion.id}
      </h1>

      <div className="mb-4">
        <p>
          <strong>Materia Prima:</strong> {preparacion.materia_prima_display}
        </p>
        <p>
          <strong>Tipo de Proceso:</strong> {preparacion.tipo_proceso}
        </p>
        <p>
          <strong>Estado:</strong> {preparacion.estado}
        </p>
        <p>
          <strong>Cantidad Procesada:</strong> {preparacion.cantidad_procesada}{" "}
          kg
        </p>
        <p>
          <strong>Porcentaje Mezcla:</strong>{" "}
          {preparacion.porcentaje_mezcla !== null
            ? `${preparacion.porcentaje_mezcla}%`
            : "N/A"}
        </p>
        <p>
          <strong>Observaciones:</strong>{" "}
          {preparacion.observaciones || "Sin observaciones"}
        </p>
        <p>
          <strong>Calidad del Resultado:</strong>{" "}
          {preparacion.calidad_resultado || "N/A"}
        </p>
        <p>
          <strong>Fecha Inicio:</strong>{" "}
          {new Date(preparacion.fecha_inicio).toLocaleString()}
        </p>
        <p>
          <strong>Fecha Completado:</strong>{" "}
          {preparacion.fecha_completado
            ? new Date(preparacion.fecha_completado).toLocaleString()
            : "Pendiente"}
        </p>
        <p>
          <strong>Preparador:</strong>{" "}
          {preparacion.usuario_preparador_display || "N/A"}
        </p>
      </div>

      <div className="flex space-x-4">
        <Link
          href={`/preparaciones/${preparacion.id}/edit`}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Editar Preparación
        </Link>
        <Link
          href="/preparaciones"
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Volver a la Lista
        </Link>
      </div>
    </div>
  );
};

export default withAuth(PreparacionDetailPage);
