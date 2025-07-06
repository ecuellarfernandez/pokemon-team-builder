/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { API_CONFIG, getAuthHeaders } from '../../../config/api';

interface Usuario {
  id: string;
  username: string;
  email: string;
  role: string;
}

interface UsuarioFormProps {
  usuario?: Usuario | null;
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormData {
  username: string;
  email: string;
  password: string;
  role: string;
}

const UsuarioForm: React.FC<UsuarioFormProps> = ({ usuario, onSuccess, onCancel }) => {
  const [formData, setFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (usuario) {
      setFormData({
        username: usuario.username,
        email: usuario.email,
        password: '',
        role: usuario.role,
      });
    }
  }, [usuario]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es requerido';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (!usuario && !formData.password.trim()) {
      newErrors.password = 'La contraseña es requerida';
    } else if (!usuario && formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.role) {
      newErrors.role = 'El rol es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const submitData: any = {
        username: formData.username,
        email: formData.email,
        role: formData.role,
      };

      // Only include password for new users or if it's being changed
      if (!usuario || formData.password.trim()) {
        submitData.password = formData.password;
      }

      if (usuario) {
        // Update existing usuario
        const response = await fetch(`${API_CONFIG.BASE_URL}/usuario/${usuario.id}`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify(submitData)
        });
        
        if (!response.ok) {
          throw new Error('Error al actualizar usuario');
        }
        toast.success('Usuario actualizado exitosamente');
      } else {
        // Create new usuario
        const response = await fetch(`${API_CONFIG.BASE_URL}/usuario`, {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(submitData)
        });
        
        if (!response.ok) {
          throw new Error('Error al crear usuario');
        }
        toast.success('Usuario creado exitosamente');
      }

      onSuccess();
    } catch (error: any) {
      console.error('Error saving usuario:', error);
      toast.error(error.response?.data?.message || 'Error al guardar usuario');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Username */}
      <div>
        <label htmlFor="username" className="block text-sm font-medium text-gray-700">
          Nombre de Usuario
        </label>
        <input
          type="text"
          id="username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.username ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Ingresa el nombre de usuario"
        />
        {errors.username && (
          <p className="mt-1 text-sm text-red-600">{errors.username}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.email ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder="Ingresa el email"
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-600">{errors.email}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Contraseña {usuario && '(dejar vacío para mantener la actual)'}
        </label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.password ? 'border-red-300' : 'border-gray-300'
          }`}
          placeholder={usuario ? 'Nueva contraseña (opcional)' : 'Ingresa la contraseña'}
        />
        {errors.password && (
          <p className="mt-1 text-sm text-red-600">{errors.password}</p>
        )}
      </div>

      {/* Role */}
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">
          Rol
        </label>
        <select
          id="role"
          name="role"
          value={formData.role}
          onChange={handleChange}
          className={`mt-1 block w-full border rounded-md px-3 py-2 shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
            errors.role ? 'border-red-300' : 'border-gray-300'
          }`}
        >
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select>
        {errors.role && (
          <p className="mt-1 text-sm text-red-600">{errors.role}</p>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          disabled={loading}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Guardando...' : usuario ? 'Actualizar' : 'Crear'}
        </button>
      </div>
    </form>
  );
};

export default UsuarioForm;