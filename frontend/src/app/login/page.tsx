'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../context/AuthContext'; // Import useAuth

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { login, isAuthenticated } = useAuth(); // Get login function and isAuthenticated from context

  // Redirect if already authenticated
  // useEffect(() => {
  //   if (isAuthenticated) {
  //     router.push('/dashboard');
  //   }
  // }, [isAuthenticated, router]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(username, password); // Call login function from context
      
      // Redirect to the dashboard
      router.push('/dashboard');

    } catch (err: any) {
      if (err.response) {
        setError('Error de credenciales. Por favor, inténtalo de nuevo.');
        console.error(err.response.data);
      } else if (err.request) {
        setError('No se pudo conectar con el servidor.');
        console.error(err.request);
      } else {
        setError('Ocurrió un error inesperado.');
        console.error('Error', err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[calc(100vh-200px)]">
      <div className="card shadow-lg p-8 bg-white rounded-lg" style={{ maxWidth: '420px', width: '100%' }}>
        <h3 className="text-2xl font-bold mb-2">Bienvenido de nuevo</h3>
        <p className="text-gray-500 mb-6">Ingresa con tu cuenta para acceder al panel</p>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="username" className="block text-gray-700 font-semibold mb-2">
              Usuario o correo
            </label>
            <input
              id="username"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              name="username"
              placeholder="usuario o correo"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password"  className="block text-gray-700 font-semibold mb-2">
              Contraseña
            </label>
            <input
              id="password"
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              name="password"
              placeholder="contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-between items-center">
            <button 
              type="submit" 
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
            <Link href="/" className="text-gray-500 hover:text-gray-700">
              Volver
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
