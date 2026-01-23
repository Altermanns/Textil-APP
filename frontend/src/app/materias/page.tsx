'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { useRouter } from 'next/navigation';

interface Materia {
  id: number;
  tipo: string;
  cantidad: number;
  unidad_medida: string;
  lote: string;
  fecha_ingreso: string;
}

const MateriasPage = () => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [materias, setMaterias] = useState<Materia[]>([]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      api.get('/materias/')
        .then(response => {
          setMaterias(response.data);
        })
        .catch(error => {
          console.error("Failed to fetch materias", error);
        });
    }
  }, [isAuthenticated]);

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      api.delete(`/materias/${id}/`)
        .then(() => {
          setMaterias(materias.filter(m => m.id !== id));
        })
        .catch(error => {
          console.error("Failed to delete materia", error);
        });
    }
  };

  if (isLoading || !isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Materias Primas</h1>
      <button
        onClick={() => router.push('/materias/create')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
      >
        Crear Materia Prima
      </button>
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">ID</th>
            <th className="py-2 px-4 border-b">Tipo</th>
            <th className="py-2 px-4 border-b">Cantidad</th>
            <th className="py-2 px-4 border-b">Unidad</th>
            <th className="py-2 px-4 border-b">Lote</th>
            <th className="py-2 px-4 border-b">Fecha Ingreso</th>
            <th className="py-2 px-4 border-b">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {materias.map(materia => (
            <tr key={materia.id}>
              <td className="py-2 px-4 border-b">{materia.id}</td>
              <td className="py-2 px-4 border-b">{materia.tipo}</td>
              <td className="py-2 px-4 border-b">{materia.cantidad}</td>
              <td className="py-2 px-4 border-b">{materia.unidad_medida}</td>
              <td className="py-2 px-4 border-b">{materia.lote}</td>
              <td className="py-2 px-4 border-b">{materia.fecha_ingreso}</td>
              <td className="py-2 px-4 border-b">
                <button
                  onClick={() => router.push(`/materias/${materia.id}/edit`)}
                  className="bg-green-500 hover:bg-green-700 text-white font-bold py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(materia.id)}
                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MateriasPage;