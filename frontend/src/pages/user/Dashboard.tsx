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

    </div>
  );
};

export default UserDashboard;