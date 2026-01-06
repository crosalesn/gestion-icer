import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import collaboratorsService from '../../../features/collaborators/services/collaborators-service';
import evaluationsService from '../../../features/evaluations/services/evaluations-service';
import clientsService from '../../../features/clients/services/clients-service';
import { EvaluationMilestone } from '../../../features/evaluations/types/template.types';
import type { CreateCollaboratorPayload } from '../../../features/collaborators/types/collaborator.types';
import type { Client } from '../../../features/clients/types/client.types';
import Button from '../../../shared/components/ui/button';
import Input from '../../../shared/components/ui/input';
import Modal from '../../../shared/components/ui/modal/modal';

interface CreateCollaboratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCollaboratorModal = ({ isOpen, onClose, onSuccess }: CreateCollaboratorModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const [loadingClients, setLoadingClients] = useState(false);
  
  const [formData, setFormData] = useState<CreateCollaboratorPayload>({
    name: '',
    email: '',
    role: '',
    project: '',
    admissionDate: new Date().toISOString().split('T')[0],
    teamLeader: '',
    clientId: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadClients();
    }
  }, [isOpen]);

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
      // 1. Create collaborator
      const newCollaborator = await collaboratorsService.create(formData);
      
      // 2. Automatically assign Day 1 evaluation
      try {
        await evaluationsService.assignEvaluation(newCollaborator.id, EvaluationMilestone.DAY_1);
        toast.success(`Colaborador ${formData.name} creado y evaluación Día 1 asignada`);
      } catch (evalError) {
        console.error('Error assigning Day 1 evaluation:', evalError);
        toast.warning(`Colaborador creado, pero hubo un error al asignar la evaluación inicial`);
      }
      
      onSuccess();
      onClose();
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        role: '',
        project: '',
        admissionDate: new Date().toISOString().split('T')[0],
        teamLeader: '',
        clientId: '',
      });
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string | string[] } } };
      // Handle array of errors or string message
      const msg = Array.isArray(axiosError.response?.data?.message) 
          ? axiosError.response.data.message.join(', ') 
          : (axiosError.response?.data?.message || 'Error al crear el colaborador');
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const noClientsAvailable = !loadingClients && clients.length === 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Nuevo Colaborador"
      size="lg"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={loading || noClientsAvailable}>
            {loading ? 'Guardando...' : 'Crear Colaborador'}
          </Button>
        </>
      }
    >
      <form id="create-collaborator-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        {noClientsAvailable && (
          <div className="bg-amber-50 text-amber-700 p-3 rounded-md text-sm">
            No hay clientes disponibles. Debe crear al menos un cliente antes de registrar colaboradores.
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
            disabled={loadingClients || noClientsAvailable}
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

export default CreateCollaboratorModal;
