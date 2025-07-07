import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminLayout from './components/layout/AdminLayout';
import UserLayout from './components/layout/UserLayout';
import AdminDashboard from './pages/admin/Dashboard';
import UserDashboard from './pages/user/Dashboard';
import Users from './pages/admin/Users';
import Items from './pages/admin/Items';
import Types from './pages/admin/Types';
import Natures from './pages/admin/Natures';
import Categories from './pages/admin/Categories';
import Abilities from './pages/admin/Abilities';
import Moves from './pages/admin/Moves';
import Pokemon from './pages/admin/Pokemon';
import EquiposList from './pages/user/EquiposList';
import EquipoEditor from './pages/user/EquipoEditor';
import PokemonExplorer from './pages/user/PokemonExplorer';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Admin Routes */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute requireAdmin>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="usuarios" element={<Users />} />
              {/* Placeholder routes for other modules */}
              <Route path="pokemon" element={<Pokemon />} />
              <Route path="movimientos" element={<Moves />} />
              <Route path="items" element={<Items />} />
              <Route path="habilidades" element={<Abilities />} />
              <Route path="tipos" element={<Types />} />
              <Route path="naturalezas" element={<Natures />} />
              <Route path="categorias" element={<Categories />} />
            </Route>
            
            {/* Protected User Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <UserLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<UserDashboard />} />
              <Route path="equipos" element={<EquiposList />} />
              <Route path="equipos/nuevo" element={<EquipoEditor />} />
              <Route path="equipos/:id/editar" element={<EquipoEditor />} />
              <Route path="pokemon" element={<PokemonExplorer />} />
            </Route>
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
