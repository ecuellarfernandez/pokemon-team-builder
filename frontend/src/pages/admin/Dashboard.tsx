import React from 'react';
import { Users, Zap, Sword, Package, Star, Type, Heart, Target } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const modules = [
    {
      name: 'Usuarios',
      description: 'Gestionar usuarios del sistema',
      icon: Users,
      href: '/admin/usuarios',
      color: 'bg-blue-500',
    },
    {
      name: 'Pokémon',
      description: 'Administrar Pokémon disponibles',
      icon: Zap,
      href: '/admin/pokemon',
      color: 'bg-yellow-500',
    },
    {
      name: 'Movimientos',
      description: 'Gestionar movimientos de Pokémon',
      icon: Sword,
      href: '/admin/movimientos',
      color: 'bg-red-500',
    },
    {
      name: 'Ítems',
      description: 'Administrar ítems del juego',
      icon: Package,
      href: '/admin/items',
      color: 'bg-green-500',
    },
    {
      name: 'Habilidades',
      description: 'Gestionar habilidades de Pokémon',
      icon: Star,
      href: '/admin/habilidades',
      color: 'bg-purple-500',
    },
    {
      name: 'Tipos',
      description: 'Administrar tipos de Pokémon',
      icon: Type,
      href: '/admin/tipos',
      color: 'bg-indigo-500',
    },
    {
      name: 'Naturalezas',
      description: 'Gestionar naturalezas de Pokémon',
      icon: Heart,
      href: '/admin/naturalezas',
      color: 'bg-pink-500',
    },
    {
      name: 'Categorías',
      description: 'Administrar categorías de movimientos',
      icon: Target,
      href: '/admin/categorias',
      color: 'bg-orange-500',
    },
  ];

  return (
    <div className="space-y-6">

      {/* Modules Grid */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Módulos de Administración</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <Link
                key={module.name}
                to={module.href}
                className="bg-white overflow-hidden shadow rounded-lg hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-6">
                  <div className="flex items-center">
                    <div className={`flex-shrink-0 p-3 rounded-md ${module.color}`}>
                      <Icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-medium text-gray-900">{module.name}</h3>
                      <p className="text-sm text-gray-500">{module.description}</p>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
            Acciones Rápidas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link
              to="/admin/usuarios"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Users className="-ml-1 mr-2 h-5 w-5" />
              Crear Usuario
            </Link>
            <Link
              to="/admin/pokemon"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-yellow-700 bg-yellow-100 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
            >
              <Zap className="-ml-1 mr-2 h-5 w-5" />
              Agregar Pokémon
            </Link>
            <Link
              to="/admin/movimientos"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              <Sword className="-ml-1 mr-2 h-5 w-5" />
              Crear Movimiento
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;