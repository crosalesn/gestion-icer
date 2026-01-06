import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import collaboratorsService from '../../../features/collaborators/services/collaborators-service';
import clientsService from '../../../features/clients/services/clients-service';
import type { Collaborator, UpdateCollaboratorPayload } from '../../../features/collaborators/types/collaborator.types';
import type { Client } from '../../../features/clients/types/client.types';
import Button from '../../../shared/components/ui/button';
import Input from '../../../shared/components/ui/input';
import Modal from '../../../shared/components/ui/modal/modal';

interface EditCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  collaborator: Collaborator;
}

const EditCollaboratorModal = ({ isOpen, onClose, onSuccess, collaborator }: EditCollaboratorModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  
  const [formData, setFormData] = useState<UpdateCollaboratorPayload>({
    name: collaborator.name,
    email: collaborator.email,
    role: collaborator.role,
    project: collaborator.project,
    admissionDate: collaborator.admissionDate.split('T')[0],
    teamLeader: collaborator.teamLeader,
    clientId: collaborator.clientId,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: collaborator.name,
        email: collaborator.email,
        role: collaborator.role,
        project: collaborator.project,
        admissionDate: collaborator.admissionDate.split('T')[0],
        teamLeader: collaborator.teamLeader,
        clientId: collaborator.clientId,
      });
      setError(null);
      loadClients();
    }
  }, [isOpen, collaborator]);

  const loadClients = async () => {
    setLoadingClients(true);
    try {
      const data = await clientsService.getAll();
      setClients(data);
    } catch (err) {
      console.error('Error loading clients:', err);
      toast.error('Error al cargar los clientes');
    } finally {
      setLoadingClients(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId) {
      setError('Debe seleccionar un cliente');
      toast.error('Debe seleccionar un cliente');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await collaboratorsService.update(collaborator.id, formData);
      toast.success(`Colaborador ${formData.name} actualizado correctamente`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string | string[] } } };
      const msg = Array.isArray(axiosError.response?.data?.message) 
        ? axiosError.response.data.message.join(', ') 
        : (axiosError.response?.data?.message || 'Error al actualizar el colaborador');
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
      title="Editar Colaborador"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </>
      }
    >
      <form id="edit-collaborator-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label htmlFor="clientId" className="block text-sm font-medium text-gray-700 mb-1">
            Cliente <span className="text-red-500">*</span>
          </label>
          <select
            id="clientId"
            name="clientId"
            required
            value={formData.clientId}
            onChange={handleChange}
            disabled={loadingClients}
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:bg-gray-100 disabled:cursor-not-allowed"
          >
            <option value="">
              {loadingClients ? 'Cargando clientes...' : 'Seleccione un cliente'}
            </option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.name}
              </option>
            ))}
          </select>
        </div>
        
        <Input
          label="Nombre Completo"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Juan Pérez"
        />

        <Input
          label="Correo Electrónico"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="juan.perez@icer.com"
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Rol / Cargo"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            placeholder="Ej: Desarrollador Frontend"
          />
          <Input
            label="Proyecto"
            name="project"
            required
            value={formData.project}
            onChange={handleChange}
            placeholder="Ej: Banco X"
          />
        </div>

        <Input
          label="Fecha de Ingreso"
          name="admissionDate"
          type="date"
          required
          value={formData.admissionDate}
          onChange={handleChange}
        />

        <Input
          label="Nombre del Team Leader"
          name="teamLeader"
          required
          value={formData.teamLeader}
          onChange={handleChange}
          placeholder="Ej: María González"
        />

      </form>
    </Modal>
  );
};

export default EditCollaboratorModal;
