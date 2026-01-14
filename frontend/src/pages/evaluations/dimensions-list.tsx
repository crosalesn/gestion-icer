import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Edit, Trash2, Search, ChevronUp, ChevronDown, ChevronsUpDown, ToggleLeft, ToggleRight, Info } from 'lucide-react';
import { clsx } from 'clsx';
import Button from '../../shared/components/ui/button';
import dimensionsService from '../../features/evaluations/services/dimensions-service';
import type { Dimension } from '../../features/evaluations/types/dimension.types';

type SortField = 'code' | 'name' | 'order' | 'isActive';
type SortDirection = 'asc' | 'desc';

const DimensionsList = () => {
  const navigate = useNavigate();
  const [dimensions, setDimensions] = useState<Dimension[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Ordenamiento
  const [sortField, setSortField] = useState<SortField>('order');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const fetchDimensions = async () => {
    try {
      setLoading(true);
      const data = await dimensionsService.getAll();
      setDimensions(data);
    } catch (error) {
      console.error('Error fetching dimensions:', error);
      toast.error('Error al cargar las dimensiones');
      setDimensions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDimensions();
  }, []);

  // Filtrado y ordenamiento
  const filteredAndSortedDimensions = useMemo(() => {
    if (!Array.isArray(dimensions) || dimensions.length === 0) {
      return [];
    }

    const filtered = dimensions.filter(d => {
      if (!d) return false;
      
      const matchesSearch = 
        (d.code?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (d.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (d.description?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || 
        (statusFilter === 'active' && d.isActive) ||
        (statusFilter === 'inactive' && !d.isActive);
      
      return matchesSearch && matchesStatus;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'code':
          aValue = a.code?.toLowerCase() || '';
          bValue = b.code?.toLowerCase() || '';
          break;
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'order':
          aValue = a.order || 0;
          bValue = b.order || 0;
          break;
        case 'isActive':
          aValue = a.isActive ? 1 : 0;
          bValue = b.isActive ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [dimensions, searchTerm, statusFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="w-4 h-4 text-gray-400" />;
    }
    return sortDirection === 'asc' 
      ? <ChevronUp className="w-4 h-4 text-brand-primary" />
      : <ChevronDown className="w-4 h-4 text-brand-primary" />;
  };

  const handleToggleStatus = async (dimension: Dimension) => {
    try {
      await dimensionsService.update(dimension.id, { isActive: !dimension.isActive });
      toast.success(`Dimensión ${!dimension.isActive ? 'activada' : 'desactivada'} correctamente`);
      fetchDimensions();
    } catch (error: any) {
      console.error('Error updating dimension status:', error);
      toast.error(error.response?.data?.message || 'Error al actualizar el estado de la dimensión');
    }
  };

  const handleDelete = async (dimension: Dimension) => {
    if (!window.confirm(`¿Estás seguro de que deseas desactivar la dimensión "${dimension.name}"?`)) {
      return;
    }

    try {
      await dimensionsService.delete(dimension.id);
      toast.success('Dimensión desactivada correctamente');
      fetchDimensions();
    } catch (error: any) {
      console.error('Error deleting dimension:', error);
      toast.error(error.response?.data?.message || 'Error al desactivar la dimensión');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Administración de Dimensiones</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las dimensiones ICER utilizadas en las evaluaciones
          </p>
        </div>
        <Button onClick={() => navigate('/evaluaciones/dimensiones/nueva')}>
          <Plus size={20} className="mr-2" />
          Nueva Dimensión
        </Button>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
        <Info className="text-blue-600 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-medium text-blue-900">Sobre las Dimensiones</h4>
          <p className="text-sm text-blue-700 mt-1">
            Las dimensiones ICER son categorías que agrupan las preguntas de las evaluaciones. 
            Al desactivar una dimensión, no se eliminará, pero dejará de estar disponible para nuevas evaluaciones.
          </p>
        </div>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                placeholder="Buscar por código, nombre o descripción..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          <div>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">Todas las dimensiones</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>
        </div>
        
        {filteredAndSortedDimensions.length !== dimensions.length && (
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {filteredAndSortedDimensions.length} de {dimensions.length} dimensiones
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando dimensiones...</div>
        ) : dimensions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg font-medium mb-2">No hay dimensiones registradas</p>
            <p className="text-sm">Crea tu primera dimensión usando el botón "Nueva Dimensión"</p>
          </div>
        ) : filteredAndSortedDimensions.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg font-medium mb-2">No se encontraron dimensiones</p>
            <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('order')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Orden</span>
                      {getSortIcon('order')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('code')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Código</span>
                      {getSortIcon('code')}
                    </div>
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('name')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Nombre</span>
                      {getSortIcon('name')}
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Descripción
                  </th>
                  <th 
                    scope="col" 
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => handleSort('isActive')}
                  >
                    <div className="flex items-center space-x-1">
                      <span>Estado</span>
                      {getSortIcon('isActive')}
                    </div>
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Acciones</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAndSortedDimensions.map((dimension) => (
                  <tr 
                    key={dimension.id} 
                    className={clsx(
                      "hover:bg-gray-50 transition-colors",
                      !dimension.isActive && "opacity-60"
                    )}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{dimension.order}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-mono text-gray-900">{dimension.code}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{dimension.name}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-500 max-w-md truncate">
                        {dimension.description || '-'}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => handleToggleStatus(dimension)}
                        className={clsx(
                          "text-sm font-medium flex items-center gap-1.5 transition-colors",
                          dimension.isActive ? "text-green-700 hover:text-green-800" : "text-gray-500 hover:text-gray-700"
                        )}
                        title={dimension.isActive ? "Desactivar dimensión" : "Activar dimensión"}
                      >
                        {dimension.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                        {dimension.isActive ? 'Activa' : 'Inactiva'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/evaluaciones/dimensiones/${dimension.id}`)}
                          className="inline-flex items-center text-brand-primary hover:text-brand-secondary transition-colors"
                          title="Editar dimensión"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(dimension)}
                          className="inline-flex items-center text-red-600 hover:text-red-700 transition-colors"
                          title="Desactivar dimensión"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DimensionsList;

