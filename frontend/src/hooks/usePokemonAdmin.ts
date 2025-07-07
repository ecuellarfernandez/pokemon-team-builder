/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { API_CONFIG, getAuthHeaders, getAuthHeadersForFormData } from '../config/api';

interface Pokemon {
  id: string;
  name: string;
  type_1_id: string;
  type_2_id?: string;
  base_hp: number;
  base_atk: number;
  base_def: number;
  base_spa: number;
  base_spd: number;
  base_spe: number;
  image_url?: string;
  type1?: {
    id: string;
    name: string;
  };
  type2?: {
    id: string;
    name: string;
  };
  created_at: string;
}

interface Type {
  id: string;
  name: string;
}

interface Habilidad {
  id: string;
  name: string;
  description?: string;
}

interface Movimiento {
  id: string;
  name: string;
  description?: string;
  power?: number;
  accuracy?: number;
  type?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
}

interface CreatePokemonData {
  name: string;
  type_1_id: string;
  type_2_id?: string;
  base_hp: number;
  base_atk: number;
  base_def: number;
  base_spa: number;
  base_spd: number;
  base_spe: number;
  image?: File | null;
  habilidad_ids: string[];
  movimiento_ids: string[];
}

const initialFormData: CreatePokemonData = {
  name: '',
  type_1_id: '',
  type_2_id: '',
  base_hp: 1,
  base_atk: 1,
  base_def: 1,
  base_spa: 1,
  base_spd: 1,
  base_spe: 1,
  image: null,
  habilidad_ids: [],
  movimiento_ids: []
};

export const usePokemonAdmin = () => {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [types, setTypes] = useState<Type[]>([]);
  const [habilidades, setHabilidades] = useState<Habilidad[]>([]);
  const [movimientos, setMovimientos] = useState<Movimiento[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<CreatePokemonData>(initialFormData);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [selectedPokemon, setSelectedPokemon] = useState<Pokemon | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const fetchPokemon = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar pokemon');
      }
      
      const data = await response.json();
      setPokemon(data);
    } catch (error) {
      console.error('Error fetching pokemon:', error);
      toast.error('Error al cargar pokemon');
    } finally {
      setLoading(false);
    }
  };

  const fetchTypes = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/tipo`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar tipos');
      }
      
      const data = await response.json();
      setTypes(data);
    } catch (error) {
      console.error('Error fetching types:', error);
      toast.error('Error al cargar tipos');
    }
  };

  const fetchHabilidades = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon/admin/habilidades`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar habilidades');
      }
      
      const data = await response.json();
      setHabilidades(data);
    } catch (error) {
      console.error('Error fetching habilidades:', error);
      toast.error('Error al cargar habilidades');
    }
  };

  const fetchMovimientos = async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon/admin/movimientos`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar movimientos');
      }
      
      const data = await response.json();
      setMovimientos(data);
    } catch (error) {
      console.error('Error fetching movimientos:', error);
      toast.error('Error al cargar movimientos');
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }
    
    if (!formData.type_1_id) {
      newErrors.type_1_id = 'El tipo primario es requerido';
    }
    
    if (formData.type_2_id && formData.type_1_id === formData.type_2_id) {
      newErrors.type_2_id = 'El tipo secundario debe ser diferente al primario';
    }
    
    if (formData.habilidad_ids.length === 0) {
      newErrors.habilidad_ids = 'Debe seleccionar al menos 1 habilidad';
    }
    
    if (formData.habilidad_ids.length > 3) {
      newErrors.habilidad_ids = 'No puede seleccionar más de 3 habilidades';
    }
    
    if (formData.movimiento_ids.length > 4) {
      newErrors.movimiento_ids = 'No puede seleccionar más de 4 movimientos';
    }
    
    const stats = ['base_hp', 'base_atk', 'base_def', 'base_spa', 'base_spd', 'base_spe'];
    stats.forEach(stat => {
      const value = formData[stat as keyof CreatePokemonData];
      if (typeof value === 'number' && value < 1) {
        newErrors[stat] = 'Las estadísticas deben ser mayor a 0';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createFormData = (): FormData => {
    const formDataToSend = new FormData();
    formDataToSend.append('name', formData.name);
    formDataToSend.append('type_1_id', formData.type_1_id);
    if (formData.type_2_id) {
      formDataToSend.append('type_2_id', formData.type_2_id);
    }
    formDataToSend.append('base_hp', formData.base_hp.toString());
    formDataToSend.append('base_atk', formData.base_atk.toString());
    formDataToSend.append('base_def', formData.base_def.toString());
    formDataToSend.append('base_spa', formData.base_spa.toString());
    formDataToSend.append('base_spd', formData.base_spd.toString());
    formDataToSend.append('base_spe', formData.base_spe.toString());
    
    // Agregar habilidades como JSON string
    formDataToSend.append('habilidad_ids', JSON.stringify(formData.habilidad_ids));
    
    // Agregar movimientos como JSON string
    if (formData.movimiento_ids.length > 0) {
      formDataToSend.append('movimiento_ids', JSON.stringify(formData.movimiento_ids));
    }
    
    if (formData.image) {
      formDataToSend.append('image', formData.image);
    }
    
    return formDataToSend;
  };

  const createPokemon = async (): Promise<boolean> => {
    if (!validateForm()) return false;
    
    try {
      const formDataToSend = createFormData();
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon`, {
        method: 'POST',
        headers: getAuthHeadersForFormData(),
        body: formDataToSend
      });
      
      if (!response.ok) {
        throw new Error('Error al crear pokemon');
      }
      
      toast.success('Pokemon creado exitosamente');
      await fetchPokemon();
      return true;
    } catch (error) {
      console.error('Error creating pokemon:', error);
      toast.error('Error al crear pokemon');
      return false;
    }
  };

  const updatePokemon = async (): Promise<boolean> => {
    if (!selectedPokemon || !validateForm()) return false;
    
    try {
      const formDataToSend = createFormData();
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon/${selectedPokemon.id}`, {
        method: 'PATCH',
        headers: getAuthHeadersForFormData(),
        body: formDataToSend
      });
      
      if (!response.ok) {
        throw new Error('Error al actualizar pokemon');
      }
      
      toast.success('Pokemon actualizado exitosamente');
      await fetchPokemon();
      return true;
    } catch (error) {
      console.error('Error updating pokemon:', error);
      toast.error('Error al actualizar pokemon');
      return false;
    }
  };

  const deletePokemon = async (pokemonId: string): Promise<boolean> => {
    try {
      setIsDeleting(true);
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon/${pokemonId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al eliminar pokemon');
      }
      
      toast.success('Pokemon eliminado exitosamente');
      await fetchPokemon();
      return true;
    } catch (error) {
      console.error('Error deleting pokemon:', error);
      toast.error('Error al eliminar pokemon');
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const loadPokemonForEdit = async (poke: Pokemon) => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/pokemon/${poke.id}`, {
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error('Error al cargar datos del pokemon');
      }
      
      const pokemonData = await response.json();
      
      // Obtener habilidades del Pokémon
      const habilidadesResponse = await fetch(`${API_CONFIG.BASE_URL}/pokemon/${poke.id}/habilidades`, {
        headers: getAuthHeaders()
      });
      const pokemonHabilidades = habilidadesResponse.ok ? await habilidadesResponse.json() : [];
      
      // Obtener movimientos del Pokémon
      const movimientosResponse = await fetch(`${API_CONFIG.BASE_URL}/pokemon/${poke.id}/movimientos`, {
        headers: getAuthHeaders()
      });
      const pokemonMovimientos = movimientosResponse.ok ? await movimientosResponse.json() : [];
      
      setSelectedPokemon(pokemonData);
      setFormData({
        name: pokemonData.name,
        type_1_id: pokemonData.type_1_id,
        type_2_id: pokemonData.type_2_id || '',
        base_hp: pokemonData.base_hp,
        base_atk: pokemonData.base_atk,
        base_def: pokemonData.base_def,
        base_spa: pokemonData.base_spa,
        base_spd: pokemonData.base_spd,
        base_spe: pokemonData.base_spe,
        image: null,
        habilidad_ids: pokemonHabilidades.map((h: any) => h.id),
        movimiento_ids: pokemonMovimientos.map((m: any) => m.id)
      });
      setImagePreview(pokemonData.image_url ? `${API_CONFIG.BASE_URL}${pokemonData.image_url}` : null);
      return true;
    } catch (error) {
      console.error('Error loading pokemon data:', error);
      toast.error('Error al cargar datos del pokemon');
      return false;
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setImagePreview(null);
    setErrors({});
    setSelectedPokemon(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleHabilidadToggle = (habilidadId: string) => {
    const currentIds = formData.habilidad_ids;
    const isSelected = currentIds.includes(habilidadId);
    
    if (isSelected) {
      setFormData({
        ...formData,
        habilidad_ids: currentIds.filter(id => id !== habilidadId)
      });
    } else if (currentIds.length < 3) {
      setFormData({
        ...formData,
        habilidad_ids: [...currentIds, habilidadId]
      });
    }
  };

  const handleMovimientoToggle = (movimientoId: string) => {
    const currentIds = formData.movimiento_ids;
    const isSelected = currentIds.includes(movimientoId);
    
    if (isSelected) {
      setFormData({
        ...formData,
        movimiento_ids: currentIds.filter(id => id !== movimientoId)
      });
    } else if (currentIds.length < 4) {
      setFormData({
        ...formData,
        movimiento_ids: [...currentIds, movimientoId]
      });
    }
  };

  useEffect(() => {
    fetchPokemon();
    fetchTypes();
    fetchHabilidades();
    fetchMovimientos();
  }, []);

  return {
    // State
    pokemon,
    types,
    habilidades,
    movimientos,
    loading,
    formData,
    setFormData,
    imagePreview,
    errors,
    selectedPokemon,
    isDeleting,
    
    // Actions
    createPokemon,
    updatePokemon,
    deletePokemon,
    loadPokemonForEdit,
    resetForm,
    handleImageChange,
    handleHabilidadToggle,
    handleMovimientoToggle,
    
    // Fetch functions
    fetchPokemon
  };
};