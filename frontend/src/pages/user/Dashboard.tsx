import React from 'react';
import { Users, Search, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido, Entrenador!</h1>
        <p className="text-gray-600">Gestiona tus equipos Pokémon y explora nuevas estrategias</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Link to="/dashboard/equipos" className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-md p-6 text-white hover:from-blue-600 hover:to-blue-700 transition-all">
          <div className="flex items-center mb-2">
            <Users className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">Mis Equipos</h3>
          </div>
          <p className="text-blue-100">Gestiona y crea tus equipos Pokémon</p>
        </Link>

        <Link to="/dashboard/pokemon" className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-md p-6 text-white hover:from-green-600 hover:to-green-700 transition-all">
          <div className="flex items-center mb-2">
            <Search className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">Explorar Pokémon</h3>
          </div>
          <p className="text-green-100">Descubre y busca Pokémon</p>
        </Link>

        <Link to="/dashboard/batallas" className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white hover:from-purple-600 hover:to-purple-700 transition-all">
          <div className="flex items-center mb-2">
            <Zap className="h-6 w-6 mr-2" />
            <h3 className="text-lg font-semibold">Batallas</h3>
          </div>
          <p className="text-purple-100">Simula combates y estrategias</p>
        </Link>
      </div>

      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Comienza tu Aventura</h2>
        <p className="text-gray-600 mb-4">
          Bienvenido al constructor de equipos Pokémon. Aquí podrás crear equipos estratégicos, 
          explorar diferentes Pokémon y planificar tus batallas.
        </p>
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">¿Por dónde empezar?</h3>
          <ul className="text-blue-800 space-y-1">
            <li>• Explora la base de datos de Pokémon</li>
            <li>• Crea tu primer equipo</li>
            <li>• Experimenta con diferentes estrategias</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;