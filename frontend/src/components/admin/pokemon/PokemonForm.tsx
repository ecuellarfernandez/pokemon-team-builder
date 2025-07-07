import React from 'react';

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

interface PokemonFormProps {
  formData: CreatePokemonData;
  setFormData: React.Dispatch<React.SetStateAction<CreatePokemonData>>;
  types: Type[];
  habilidades: Habilidad[];
  movimientos: Movimiento[];
  errors: { [key: string]: string };
  imagePreview: string | null;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHabilidadToggle: (habilidadId: string) => void;
  onMovimientoToggle: (movimientoId: string) => void;
}

const PokemonForm: React.FC<PokemonFormProps> = ({
  formData,
  setFormData,
  types,
  habilidades,
  movimientos,
  errors,
  imagePreview,
  onImageChange,
  onHabilidadToggle,
  onMovimientoToggle
}) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.name ? 'border-red-300' : 'border-gray-300'
            }`}
            placeholder="Ingresa el nombre del pokemon"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagen
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo Primario *
          </label>
          <select
            value={formData.type_1_id}
            onChange={(e) => setFormData({ ...formData, type_1_id: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.type_1_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona el tipo primario</option>
            {types.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.type_1_id && (
            <p className="mt-1 text-sm text-red-600">{errors.type_1_id}</p>
          )}
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo Secundario (opcional)
          </label>
          <select
            value={formData.type_2_id}
            onChange={(e) => setFormData({ ...formData, type_2_id: e.target.value })}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
              errors.type_2_id ? 'border-red-300' : 'border-gray-300'
            }`}
          >
            <option value="">Selecciona el tipo secundario</option>
            {types.filter(type => type.id !== formData.type_1_id).map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
          {errors.type_2_id && (
            <p className="mt-1 text-sm text-red-600">{errors.type_2_id}</p>
          )}
        </div>
      </div>
      
      {imagePreview && (
        <div className="flex justify-center">
          <img
            src={imagePreview.startsWith('data:') ? imagePreview : `${imagePreview}`}
            alt="Preview"
            className="h-32 w-32 object-cover rounded-md border"
          />
        </div>
      )}
      
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">Estadísticas Base</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              HP
            </label>
            <input
              type="number"
              min="1"
              value={formData.base_hp}
              onChange={(e) => setFormData({ ...formData, base_hp: parseInt(e.target.value) || 1 })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.base_hp ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.base_hp && (
              <p className="mt-1 text-sm text-red-600">{errors.base_hp}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ATK
            </label>
            <input
              type="number"
              min="1"
              value={formData.base_atk}
              onChange={(e) => setFormData({ ...formData, base_atk: parseInt(e.target.value) || 1 })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.base_atk ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.base_atk && (
              <p className="mt-1 text-sm text-red-600">{errors.base_atk}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              DEF
            </label>
            <input
              type="number"
              min="1"
              value={formData.base_def}
              onChange={(e) => setFormData({ ...formData, base_def: parseInt(e.target.value) || 1 })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.base_def ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.base_def && (
              <p className="mt-1 text-sm text-red-600">{errors.base_def}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SPA
            </label>
            <input
              type="number"
              min="1"
              value={formData.base_spa}
              onChange={(e) => setFormData({ ...formData, base_spa: parseInt(e.target.value) || 1 })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.base_spa ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.base_spa && (
              <p className="mt-1 text-sm text-red-600">{errors.base_spa}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SPD
            </label>
            <input
              type="number"
              min="1"
              value={formData.base_spd}
              onChange={(e) => setFormData({ ...formData, base_spd: parseInt(e.target.value) || 1 })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.base_spd ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.base_spd && (
              <p className="mt-1 text-sm text-red-600">{errors.base_spd}</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              SPE
            </label>
            <input
              type="number"
              min="1"
              value={formData.base_spe}
              onChange={(e) => setFormData({ ...formData, base_spe: parseInt(e.target.value) || 1 })}
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                errors.base_spe ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errors.base_spe && (
              <p className="mt-1 text-sm text-red-600">{errors.base_spe}</p>
            )}
          </div>
        </div>
      </div>
      
      {/* Habilidades */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Habilidades ({formData.habilidad_ids.length}/3)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-3">
          {habilidades.map((habilidad) => (
            <label key={habilidad.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.habilidad_ids.includes(habilidad.id)}
                onChange={() => onHabilidadToggle(habilidad.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{habilidad.name}</span>
            </label>
          ))}
        </div>
        {errors.habilidad_ids && (
          <p className="mt-1 text-sm text-red-600">{errors.habilidad_ids}</p>
        )}
      </div>
      
      {/* Movimientos */}
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-3">
          Movimientos ({formData.movimiento_ids.length}/4)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-60 overflow-y-auto border border-gray-200 rounded-md p-3">
          {movimientos.map((movimiento) => (
            <label key={movimiento.id} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.movimiento_ids.includes(movimiento.id)}
                onChange={() => onMovimientoToggle(movimiento.id)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">{movimiento.name}</span>
            </label>
          ))}
        </div>
        {errors.movimiento_ids && (
          <p className="mt-1 text-sm text-red-600">{errors.movimiento_ids}</p>
        )}
      </div>
    </div>
  );
};

export default PokemonForm;