import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';
import Button from '../../shared/components/ui/button';
import Input from '../../shared/components/ui/input';
import dimensionsService from '../../features/evaluations/services/dimensions-service';
import type { CreateDimensionPayload, UpdateDimensionPayload } from '../../features/evaluations/types/dimension.types';

const DimensionForm = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = !!id;
  
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(isEdit);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<CreateDimensionPayload>({
    code: '',
    name: '',
    description: '',
    order: 1,
    isActive: true,
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchDimension = async () => {
        try {
          setLoadingData(true);
          const dimension = await dimensionsService.getById(id);
          setFormData({
            code: dimension.code,
            name: dimension.name,
            description: dimension.description || '',
            order: dimension.order,
            isActive: dimension.isActive,
          });
        } catch (error: any) {
          console.error('Error fetching dimension:', error);
          toast.error(error.response?.data?.message || 'Error al cargar la dimensión');
          navigate('/evaluaciones/dimensiones');
        } finally {
          setLoadingData(false);
        }
      };
      fetchDimension();
    }
  }, [id, isEdit, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      if (isEdit && id) {
        const updatePayload: UpdateDimensionPayload = {
          code: formData.code,
          name: formData.name,
          description: formData.description || null,
          order: formData.order,
          isActive: formData.isActive,
        };
        await dimensionsService.update(id, updatePayload);
        toast.success('Dimensión actualizada exitosamente');
      } else {
        await dimensionsService.create(formData);
        toast.success('Dimensión creada exitosamente');
      }
      
      setSuccess(true);
      setTimeout(() => {
        navigate('/evaluaciones/dimensiones');
      }, 1500);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 
        (isEdit ? 'Error al actualizar la dimensión' : 'Error al crear la dimensión');
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="space-y-6 max-w-2xl mx-auto">
        <div className="p-8 text-center text-gray-500">Cargando dimensión...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate('/evaluaciones/dimensiones')} className="p-2">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEdit ? 'Editar Dimensión' : 'Nueva Dimensión'}
            </h1>
            <p className="text-sm text-gray-500">
              {isEdit ? 'Modifica los datos de la dimensión ICER' : 'Crea una nueva dimensión ICER para las evaluaciones'}
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-red-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          {success && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Save className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    {isEdit ? 'Dimensión actualizada exitosamente. Redirigiendo...' : 'Dimensión creada exitosamente. Redirigiendo...'}
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input
                id="code"
                label="Código"
                name="code"
                type="text"
                required
                placeholder="INTEGRATION"
                value={formData.code}
                onChange={handleChange}
                disabled={isEdit}
                className="mt-1 font-mono"
              />
              <p className="mt-1 text-xs text-gray-500">
                Código único identificador (no se puede modificar después de crear)
              </p>
            </div>

            <div>
              <Input
                id="order"
                label="Orden"
                name="order"
                type="number"
                required
                min="1"
                value={formData.order}
                onChange={handleChange}
                className="mt-1"
              />
              <p className="mt-1 text-xs text-gray-500">
                Orden de visualización (menor número = aparece primero)
              </p>
            </div>
          </div>

          <div>
            <Input
              id="name"
              label="Nombre"
              name="name"
              type="text"
              required
              placeholder="Integración"
              value={formData.name}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              placeholder="Mide el nivel de integración del colaborador con el equipo y la organización"
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
          </div>

          <div className="flex items-center">
            <input
              id="isActive"
              name="isActive"
              type="checkbox"
              checked={formData.isActive}
              onChange={handleChange}
              className="h-4 w-4 text-brand-primary focus:ring-brand-primary border-gray-300 rounded"
            />
            <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
              Dimensión activa
            </label>
            <p className="ml-2 text-xs text-gray-500">
              (Las dimensiones inactivas no estarán disponibles para nuevas evaluaciones)
            </p>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <Button 
              type="button" 
              variant="ghost" 
              onClick={() => navigate('/evaluaciones/dimensiones')} 
              className="mr-3"
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading} isLoading={loading}>
              {isEdit ? 'Actualizar Dimensión' : 'Crear Dimensión'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DimensionForm;

