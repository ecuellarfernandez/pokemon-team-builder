import React from 'react';
import { Users, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserDashboard: React.FC = () => {
  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">¡Bienvenido, Entrenador!</h1>
        <p className="text-gray-600">Gestiona tus equipos Pokémon y explora nuevas estrategias</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
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
          <p className="text-green-100">Descubre y analiza Pokémon</p>
        </Link>
      </div>

      {/* Welcome Message */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Bienvenido al Team Builder</h2>
        <p className="text-gray-600 mb-4">
          Aquí puedes crear y gestionar tus equipos Pokémon, 
          explorar diferentes Pokémon y planificar tus estrategias.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">💡 Consejo</h3>
            <p className="text-blue-700 text-sm">
              Un equipo balanceado incluye diferentes tipos de Pokémon para cubrir las debilidades de cada uno.
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-green-900 mb-2">🎯 Estrategia</h3>
            <p className="text-green-700 text-sm">
              Considera las estadísticas base, habilidades y movimientos al formar tu equipo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;