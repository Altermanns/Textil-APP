'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import api from '../../../services/api';
import { useRouter, useParams } from 'next/navigation';

interface Materia {
  id: number;
  tipo: string;
  cantidad: number;
  unidad_medida: string;
  lote: string;
  fecha_ingreso: string;
}

const EditMateriaPage = () => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const materiaId = params.id; // Get id from URL

  const [formData, setFormData] = useState<Materia>({
    id: 0,
    tipo: '',
    cantidad: 0,
    unidad_medida: '',
    lote: '',
    fecha_ingreso: '',
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    if (materiaId) {
      api.get(`/materias/${materiaId}/`)
        .then(response => {
          setFormData(response.data);
        })
        .catch(error => {
          console.error("Failed to fetch materia for editing", error);
        });
    }
  }, [isAuthenticated, router, materiaId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    api.put(`/materias/${materiaId}/`, formData)
      .then(() => {
        router.push('/materias');
      })
      .catch(error => {
        console.error("Failed to update materia", error);
        // You might want to show an error message to the user
      });
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Editar Materia Prima</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="tipo">Tipo</label>
          <input
            type="text"
            name="tipo"
            id="tipo"
            value={formData.tipo}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="cantidad">Cantidad</label>
          <input
            type="number"
            name="cantidad"
            id="cantidad"
            value={formData.cantidad}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="unidad_medida">Unidad de Medida</label>
          <input
            type="text"
            name="unidad_medida"
            id="unidad_medida"
            value={formData.unidad_medida}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lote">Lote</label>
          <input
            type="text"
            name="lote"
            id="lote"
            value={formData.lote}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="fecha_ingreso">Fecha de Ingreso</label>
          <input
            type="date"
            name="fecha_ingreso"
            id="fecha_ingreso"
            value={formData.fecha_ingreso}
            onChange={handleChange}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Guardar Cambios
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditMateriaPage;