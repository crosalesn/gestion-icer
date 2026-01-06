import { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO, differenceInDays } from 'date-fns';
import toast from 'react-hot-toast';
import collaboratorsService from '../../features/collaborators/services/collaborators-service';
import type { Collaborator } from '../../features/collaborators/types/collaborator.types';
import Button from '../../shared/components/ui/button';
import { Plus, Search, AlertTriangle, CheckCircle, ChevronUp, ChevronDown, ChevronsUpDown, Eye, Trash2, Edit, Clock, ArrowRight } from 'lucide-react';
import { clsx } from 'clsx';
import CreateCollaboratorModal from './components/create-collaborator-modal';
import EditCollaboratorModal from './components/edit-collaborator-modal';
import { ProcessProgress } from './components/process-progress';

type SortField = 'name' | 'admissionDate' | 'status' | 'riskLevel' | 'project' | 'role';
type SortDirection = 'asc' | 'desc';

const CollaboratorsList = () => {
  const navigate = useNavigate();
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  
  // Filtros
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [riskFilter, setRiskFilter] = useState<string>('all');
  
  // Ordenamiento
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchCollaborators = async () => {
    try {
      setLoading(true);
      const data = await collaboratorsService.getAll();
      setCollaborators(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching collaborators:', error);
      setCollaborators([]);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (collaborator: Collaborator) => {
    setSelectedCollaborator(collaborator);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (collaborator: Collaborator) => {
    if (!confirm(`¿Estás seguro de eliminar a ${collaborator.name}? Esta acción no se puede deshacer.`)) {
      return;
    }

    try {
      await collaboratorsService.delete(collaborator.id);
      toast.success(`Colaborador ${collaborator.name} eliminado correctamente`);
      await fetchCollaborators();
    } catch (error: any) {
      console.error('Error deleting collaborator:', error);
      toast.error(error.response?.data?.message || 'Error al eliminar el colaborador');
    }
  };

  useEffect(() => {
    fetchCollaborators();
  }, []);

  // Filtrado y ordenamiento
  const filteredAndSortedCollaborators = useMemo(() => {
    if (!Array.isArray(collaborators) || collaborators.length === 0) {
      return [];
    }

    let filtered = collaborators.filter(c => {
      if (!c) return false;
      
      const matchesSearch = 
        (c.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.project?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.role?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
        (c.teamLeader?.toLowerCase() || '').includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
      const matchesRisk = riskFilter === 'all' || c.riskLevel === riskFilter;
      
      return matchesSearch && matchesStatus && matchesRisk;
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'admissionDate':
          try {
            aValue = a.admissionDate ? parseISO(a.admissionDate).getTime() : 0;
            bValue = b.admissionDate ? parseISO(b.admissionDate).getTime() : 0;
          } catch (e) {
            console.error('Error parsing dates for sorting:', e);
            aValue = 0;
            bValue = 0;
          }
          break;
        case 'status':
          aValue = a.status || '';
          bValue = b.status || '';
          break;
        case 'riskLevel':
          const riskOrder = { HIGH: 4, MEDIUM: 3, LOW: 2, NONE: 1 };
          aValue = riskOrder[a.riskLevel as keyof typeof riskOrder] || 0;
          bValue = riskOrder[b.riskLevel as keyof typeof riskOrder] || 0;
          break;
        case 'project':
          aValue = a.project?.toLowerCase() || '';
          bValue = b.project?.toLowerCase() || '';
          break;
        case 'role':
          aValue = a.role?.toLowerCase() || '';
          bValue = b.role?.toLowerCase() || '';
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [collaborators, searchTerm, statusFilter, riskFilter, sortField, sortDirection]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedCollaborators.length / itemsPerPage);
  const paginatedCollaborators = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedCollaborators.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedCollaborators, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

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

  const getRiskBadge = (level: string | undefined | null) => {
    // Normalizar el valor: convertir a string y uppercase, manejar null/undefined
    const normalizedLevel = level ? String(level).toUpperCase().trim() : 'NONE';
    
    switch (normalizedLevel) {
      case 'HIGH':
        return (
          <div className="flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 border border-red-200" title="Riesgo Alto">
              <AlertTriangle size={12} />
              <span>ALTO</span>
            </span>
          </div>
        );
      case 'MEDIUM':
        return (
          <div className="flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700 border border-amber-200" title="Riesgo Medio">
              <AlertTriangle size={12} />
              <span>MEDIO</span>
            </span>
          </div>
        );
      case 'LOW':
        return (
          <div className="flex flex-col items-center">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200" title="Riesgo Bajo">
              <CheckCircle size={12} />
              <span>BAJO</span>
            </span>
          </div>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-400" title="Sin Riesgo">
            -
          </span>
        );
    }
  };

  const getDaysActive = (dateStr: string) => {
    try {
      if (!dateStr) return 0;
      return differenceInDays(new Date(), parseISO(dateStr));
    } catch {
      return 0;
    }
  };

  const getNextAction = (collab: Collaborator) => {
    if (collab.riskLevel === 'HIGH') {
      return { text: 'Revisar Plan', priority: 'high' };
    }
    
    switch (collab.status) {
      case 'PENDING_DAY_1':
        return { text: 'Eval. Día 1', priority: 'normal' };
      case 'PENDING_WEEK_1':
        return { text: 'Eval. Semana 1', priority: 'normal' };
      case 'PENDING_MONTH_1':
        return { text: 'Eval. Mes 1', priority: 'normal' };
      default:
        return { text: 'Completado', priority: 'low' };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Colaboradores</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administración de nuevos ingresos y seguimiento ICER
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus size={20} className="mr-2" />
          Nuevo Colaborador
        </Button>
      </div>

      <CreateCollaboratorModal 
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={() => {
          setIsCreateModalOpen(false);
          fetchCollaborators();
        }}
      />

      {selectedCollaborator && (
        <EditCollaboratorModal 
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedCollaborator(null);
          }}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setSelectedCollaborator(null);
            fetchCollaborators();
          }}
          collaborator={selectedCollaborator}
        />
      )}

      {/* Filtros y Búsqueda */}
      <div className="bg-white shadow rounded-lg p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                placeholder="Buscar por nombre, email, proyecto, rol o líder..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>
          
          <div>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Todos los estados</option>
              <option value="PENDING_DAY_1">Pendiente Día 1</option>
              <option value="PENDING_WEEK_1">Pendiente Semana 1</option>
              <option value="PENDING_MONTH_1">Pendiente Mes 1</option>
              <option value="FINISHED">Finalizado</option>
            </select>
          </div>
          
          <div>
            <select
              className="block w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-primary focus:border-brand-primary"
              value={riskFilter}
              onChange={(e) => {
                setRiskFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="all">Todos los riesgos</option>
              <option value="HIGH">Alto</option>
              <option value="MEDIUM">Medio</option>
              <option value="LOW">Bajo</option>
              <option value="NONE">Sin Riesgo</option>
            </select>
          </div>
        </div>
        
        {filteredAndSortedCollaborators.length !== collaborators.length && (
          <div className="mt-3 text-sm text-gray-600">
            Mostrando {filteredAndSortedCollaborators.length} de {collaborators.length} colaboradores
          </div>
        )}
        {/* Debug info - remover en producción */}
        {import.meta.env.DEV && (
          <div className="mt-3 text-xs text-gray-400">
            Debug: Total={collaborators.length}, Filtrados={filteredAndSortedCollaborators.length}, 
            Paginados={paginatedCollaborators.length}, Página={currentPage}/{totalPages}
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando colaboradores...</div>
        ) : collaborators.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg font-medium mb-2">No hay colaboradores registrados</p>
            <p className="text-sm">Crea tu primer colaborador usando el botón "Nuevo Colaborador"</p>
          </div>
        ) : filteredAndSortedCollaborators.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <p className="text-lg font-medium mb-2">No se encontraron colaboradores</p>
            <p className="text-sm">Intenta ajustar los filtros de búsqueda</p>
            <p className="text-xs mt-2 text-gray-400">Total de colaboradores: {collaborators.length}</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Colaborador / Proyecto</span>
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('admissionDate')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Ingreso / Días</span>
                        {getSortIcon('admissionDate')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('status')}
                    >
                      <div className="flex items-center gap-1">
                        <span>Progreso ICER</span>
                        {getSortIcon('status')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase cursor-pointer hover:bg-gray-100"
                      onClick={() => handleSort('riskLevel')}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>Riesgo</span>
                        {getSortIcon('riskLevel')}
                      </div>
                    </th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Próxima Acción
                    </th>
                    <th scope="col" className="px-4 py-3 text-center text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {(() => {
                    return paginatedCollaborators.map((collab, index) => {
                      if (!collab) return null;
                      
                      const daysActive = getDaysActive(collab.admissionDate);
                      const nextAction = getNextAction(collab);
                      
                      return (
                      <tr key={collab.id || `collab-${index}`} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm font-semibold text-gray-900">{collab?.name || 'Sin nombre'}</span>
                          <span className="text-xs text-gray-500 mb-0.5">{collab?.role || '-'}</span>
                          <span className="text-xs text-brand-primary font-medium bg-brand-primary/5 px-1.5 py-0.5 rounded w-fit">
                            {collab?.project || '-'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col">
                          <span className="text-sm text-gray-900">
                            {collab?.admissionDate ? (() => {
                              try {
                                return format(parseISO(collab.admissionDate), 'dd/MM/yyyy');
                              } catch (e) {
                                return '-';
                              }
                            })() : '-'}
                          </span>
                          <span className="text-xs text-gray-500 flex items-center gap-1 mt-0.5">
                            <Clock size={10} />
                            {daysActive} días
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                         <ProcessProgress status={collab?.status || 'PENDING_DAY_1'} />
                      </td>
                      <td className="px-4 py-3 text-center">
                        {(() => {
                          const riskLevel = collab?.riskLevel;
                          return getRiskBadge(riskLevel);
                        })()}
                      </td>
                      <td className="px-4 py-3">
                        <div className={clsx(
                          "flex items-center gap-1.5 text-xs font-medium",
                          nextAction.priority === 'high' ? "text-red-600" : 
                          nextAction.priority === 'low' ? "text-green-600" : "text-gray-600"
                        )}>
                          {nextAction.priority !== 'low' && <ArrowRight size={12} />}
                          {nextAction.text}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center gap-1.5">
                          <button 
                            onClick={() => navigate(`/colaboradores/${collab?.id}`)}
                            className="p-1.5 text-brand-primary hover:bg-brand-primary/10 rounded transition-colors"
                            disabled={!collab?.id}
                            title="Ver detalle"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEdit(collab);
                            }}
                            className="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                            disabled={!collab?.id}
                            title="Editar"
                          >
                            <Edit size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDelete(collab);
                            }}
                            className="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                            disabled={!collab?.id}
                            title="Eliminar"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Anterior
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Siguiente
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> a{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * itemsPerPage, filteredAndSortedCollaborators.length)}
                      </span>{' '}
                      de <span className="font-medium">{filteredAndSortedCollaborators.length}</span> resultados
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Anterior
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (
                          page === 1 ||
                          page === totalPages ||
                          (page >= currentPage - 1 && page <= currentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setCurrentPage(page)}
                              className={clsx(
                                "relative inline-flex items-center px-4 py-2 border text-sm font-medium",
                                currentPage === page
                                  ? "z-10 bg-brand-primary border-brand-primary text-white"
                                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
                              )}
                            >
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return (
                            <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Siguiente
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CollaboratorsList;
