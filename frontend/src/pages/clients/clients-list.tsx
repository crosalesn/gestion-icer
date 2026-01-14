import { useEffect, useState, useMemo } from 'react';
import toast from 'react-hot-toast';
import { parseISO } from 'date-fns';
import { formatDate } from '../../shared/utils/date-utils';
import clientsService from '../../features/clients/services/clients-service';
import type { Client, CreateClientPayload } from '../../features/clients/types/client.types';
import Button from '../../shared/components/ui/button';
import Input from '../../shared/components/ui/input';
import Modal from '../../shared/components/ui/modal/modal';
import { 
  Plus, 
  Search, 
  ChevronUp, 
  ChevronDown, 
  ChevronsUpDown, 
  Pencil, 
  Trash2,
  Building2
} from 'lucide-react';
import { clsx } from 'clsx';

type SortField = 'name' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface ClientFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  client?: Client | null;
}

const ClientFormModal = ({ isOpen, onClose, onSuccess, client }: ClientFormModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [name, setName] = useState('');

  const isEditing = !!client;

  useEffect(() => {
    if (client) {
      setName(client.name);
    } else {
      setName('');
    }
    setError(null);
  }, [client, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim()) {
      setError('El nombre del cliente es requerido');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: CreateClientPayload = { name: name.trim() };
      
      if (isEditing && client) {
        await clientsService.update(client.id, payload);
        toast.success('Cliente actualizado exitosamente');
      } else {
        await clientsService.create(payload);
        toast.success('Cliente creado exitosamente');
      }
      
      onSuccess();
      onClose();
      setName('');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string | string[] } } };
      const msg = Array.isArray(error.response?.data?.message) 
        ? error.response.data.message.join(', ') 
        : (error.response?.data?.message || `Error al ${isEditing ? 'actualizar' : 'crear'} el cliente`);
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
      size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} isLoading={loading}>
            {isEditing ? 'Guardar Cambios' : 'Crear Cliente'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}
        
        <Input
          label="Nombre del Cliente"
          name="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Empresa ABC"
          autoFocus
          icon={<Building2 size={18} />}
        />
      </form>
    </Modal>
  );
};

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  clientName: string;
  loading: boolean;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, clientName, loading }: DeleteConfirmModalProps) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Confirmar Eliminación"
      size="sm"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="danger" onClick={onConfirm} isLoading={loading}>
            Eliminar
          </Button>
        </>
      }
    >
      <div className="text-center py-4">
        <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-xl bg-red-100 mb-4 border border-red-200">
          <Trash2 className="h-7 w-7 text-red-600" />
        </div>
        <p className="text-slate-600">
          ¿Estás seguro de que deseas eliminar el cliente{' '}
          <span className="font-semibold text-slate-900">"{clientName}"</span>?
        </p>
        <p className="text-sm text-slate-500 mt-2">
          Esta acción no se puede deshacer.
        </p>
      </div>
    </Modal>
  );
};

const ClientsList = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Ordenamiento
  const [sortField, setSortField] = useState<SortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Modals
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const fetchClients = async () => {
    try {
      setLoading(true);
      const data = await clientsService.getAll();
      setClients(data);
    } catch (error) {
      console.error('Error fetching clients:', error);
      toast.error('Error al cargar los clientes');
      setClients([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // Filtrado y ordenamiento
  const filteredAndSortedClients = useMemo(() => {
    if (!Array.isArray(clients) || clients.length === 0) {
      return [];
    }

    const filtered = clients.filter(c => {
      if (!c) return false;
      return (c.name?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    });

    // Ordenamiento
    filtered.sort((a, b) => {
      if (!a || !b) return 0;
      
      let aValue: string | number;
      let bValue: string | number;

      switch (sortField) {
        case 'name':
          aValue = a.name?.toLowerCase() || '';
          bValue = b.name?.toLowerCase() || '';
          break;
        case 'createdAt':
          try {
            aValue = a.createdAt ? parseISO(a.createdAt).getTime() : 0;
            bValue = b.createdAt ? parseISO(b.createdAt).getTime() : 0;
          } catch {
            aValue = 0;
            bValue = 0;
          }
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [clients, searchTerm, sortField, sortDirection]);

  // Paginación
  const totalPages = Math.ceil(filteredAndSortedClients.length / itemsPerPage);
  const paginatedClients = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedClients.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedClients, currentPage]);

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

  const handleCreate = () => {
    setSelectedClient(null);
    setIsFormModalOpen(true);
  };

  const handleEdit = (client: Client) => {
    setSelectedClient(client);
    setIsFormModalOpen(true);
  };

  const handleDeleteClick = (client: Client) => {
    setSelectedClient(client);
    setIsDeleteModalOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!selectedClient) return;
    
    setDeleteLoading(true);
    try {
      await clientsService.delete(selectedClient.id);
      toast.success('Cliente eliminado exitosamente');
      setIsDeleteModalOpen(false);
      setSelectedClient(null);
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      toast.error('Error al eliminar el cliente');
    } finally {
      setDeleteLoading(false);
    }
  };


  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start flex-col gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="pill bg-brand-primary/10 text-brand-primary border border-brand-primary/20 inline-block mb-1">Administración</p>
          <h1 className="text-2xl font-bold text-slate-900">Clientes</h1>
          <p className="mt-1 text-sm text-slate-500">
            Administración de clientes (organizaciones/empresas)
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus size={20} className="mr-2" />
          Nuevo Cliente
        </Button>
      </div>

      {/* Búsqueda */}
      <div className="card p-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:max-w-lg">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-[var(--color-border-subtle)] rounded-xl leading-5 bg-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-brand-primary sm:text-sm shadow-[var(--shadow-soft)] transition-all"
            placeholder="Buscar por nombre..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>
        
        {filteredAndSortedClients.length !== clients.length && (
          <div className="text-sm text-slate-600 bg-brand-surface-strong px-4 py-2 rounded-lg border border-[var(--color-border-subtle)]">
            Mostrando {filteredAndSortedClients.length} de {clients.length} clientes
          </div>
        )}
      </div>

      {/* Tabla */}
      <div className="table-shell">
        {loading ? (
          <div className="p-8 text-center text-slate-500">Cargando clientes...</div>
        ) : clients.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <Building2 size={48} className="mx-auto mb-4 text-slate-300" />
            <p className="text-lg font-semibold mb-2 text-slate-900">No hay clientes registrados</p>
            <p className="text-sm">Crea tu primer cliente usando el botón "Nuevo Cliente"</p>
          </div>
        ) : filteredAndSortedClients.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            <p className="text-lg font-semibold mb-2 text-slate-900">No se encontraron clientes</p>
            <p className="text-sm">Intenta ajustar el término de búsqueda</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-[var(--color-border-subtle)]">
                <thead>
                  <tr>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-brand-primary/5 transition-colors"
                      onClick={() => handleSort('name')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Nombre</span>
                        {getSortIcon('name')}
                      </div>
                    </th>
                    <th 
                      scope="col" 
                      className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-brand-primary/5 transition-colors"
                      onClick={() => handleSort('createdAt')}
                    >
                      <div className="flex items-center space-x-1">
                        <span>Fecha de Creación</span>
                        {getSortIcon('createdAt')}
                      </div>
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">Acciones</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-[var(--color-border-subtle)]">
                  {paginatedClients.map((client) => (
                    <tr key={client.id} className="transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 rounded-xl bg-brand-primary/10 flex items-center justify-center text-brand-primary font-semibold border border-brand-primary/20">
                            {(client.name || '?').charAt(0).toUpperCase()}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-slate-900">{client.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                        {formatDate(client.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <button 
                            className="inline-flex items-center text-brand-primary hover:text-brand-primary-strong transition-colors p-1 rounded-full hover:bg-brand-primary/10"
                            onClick={() => handleEdit(client)}
                            title="Editar"
                          >
                            <Pencil size={16} />
                          </button>
                          <button 
                            className="inline-flex items-center text-red-500 hover:text-red-700 transition-colors p-1 rounded-full hover:bg-red-50"
                            onClick={() => handleDeleteClick(client)}
                            title="Eliminar"
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

            {/* Paginación */}
            {totalPages > 1 && (
              <div className="bg-white/80 px-4 py-3 flex items-center justify-between border-t border-[var(--color-border-subtle)] sm:px-6">
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
                        {Math.min(currentPage * itemsPerPage, filteredAndSortedClients.length)}
                      </span>{' '}
                      de <span className="font-medium">{filteredAndSortedClients.length}</span> resultados
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

      {/* Modals */}
      <ClientFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedClient(null);
        }}
        onSuccess={fetchClients}
        client={selectedClient}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setSelectedClient(null);
        }}
        onConfirm={handleDeleteConfirm}
        clientName={selectedClient?.name || ''}
        loading={deleteLoading}
      />
    </div>
  );
};

export default ClientsList;

