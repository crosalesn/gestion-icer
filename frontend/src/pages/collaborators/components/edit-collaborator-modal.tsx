import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import DatePicker, { registerLocale } from 'react-datepicker';
import { es } from 'date-fns/locale';
import 'react-datepicker/dist/react-datepicker.css';
import collaboratorsService from '../../../features/collaborators/services/collaborators-service';
import clientsService from '../../../features/clients/services/clients-service';
import { parseDate } from '../../../shared/utils/date-utils';
import type { Collaborator, UpdateCollaboratorPayload } from '../../../features/collaborators/types/collaborator.types';
import type { Client } from '../../../features/clients/types/client.types';
import Button from '../../../shared/components/ui/button';
import Input from '../../../shared/components/ui/input';
import Select from '../../../shared/components/ui/select';
import Modal from '../../../shared/components/ui/modal/modal';
import { User, Mail, Briefcase, FolderKanban, Users, Building2, Calendar } from 'lucide-react';

// Registrar locale español
registerLocale('es', es);

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
  const [admissionDate, setAdmissionDate] = useState<Date | null>(
    parseDate(collaborator.admissionDate)
  );
  
  const [formData, setFormData] = useState<Omit<UpdateCollaboratorPayload, 'admissionDate'>>({
    name: collaborator.name,
    email: collaborator.email,
    role: collaborator.role,
    project: collaborator.project,
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
        teamLeader: collaborator.teamLeader,
        clientId: collaborator.clientId,
      });
      setAdmissionDate(parseDate(collaborator.admissionDate));
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

  // Formatear fecha a YYYY-MM-DD
  const formatDateToISO = (date: Date | null): string => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.clientId) {
      setError('Debe seleccionar un cliente');
      toast.error('Debe seleccionar un cliente');
      return;
    }

    if (!admissionDate) {
      setError('Debe seleccionar una fecha de ingreso');
      toast.error('Debe seleccionar una fecha de ingreso');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const payload: UpdateCollaboratorPayload = {
        ...formData,
        admissionDate: formatDateToISO(admissionDate),
      };
      await collaboratorsService.update(collaborator.id, payload);
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
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

        <Select
          id="clientId"
          name="clientId"
          label="Cliente"
          required
          value={String(formData.clientId)}
          onChange={handleChange}
          disabled={loadingClients}
          icon={<Building2 size={18} />}
          options={[
            { value: '', label: loadingClients ? 'Cargando clientes...' : 'Seleccione un cliente' },
            ...clients.map(client => ({ value: String(client.id), label: client.name }))
          ]}
        />
        
        <Input
          label="Nombre Completo"
          name="name"
          required
          value={formData.name}
          onChange={handleChange}
          placeholder="Ej: Juan Pérez"
          icon={<User size={18} />}
        />

        <Input
          label="Correo Electrónico"
          name="email"
          type="email"
          required
          value={formData.email}
          onChange={handleChange}
          placeholder="juan.perez@icer.com"
          icon={<Mail size={18} />}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Rol / Cargo"
            name="role"
            required
            value={formData.role}
            onChange={handleChange}
            placeholder="Ej: Desarrollador Frontend"
            icon={<Briefcase size={18} />}
          />
          <Input
            label="Proyecto"
            name="project"
            required
            value={formData.project}
            onChange={handleChange}
            placeholder="Ej: Banco X"
            icon={<FolderKanban size={18} />}
          />
        </div>

        <div>
          <label className="floating-label mb-1.5">
            Fecha de Ingreso <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar size={18} className="text-slate-400" />
            </div>
            <DatePicker
              selected={admissionDate}
              onChange={(date: Date | null) => setAdmissionDate(date)}
              dateFormat="dd/MM/yyyy"
              locale="es"
              placeholderText="dd/mm/aaaa"
              className="block w-full pl-10 pr-3 py-3 border border-[var(--color-border-subtle)] rounded-xl shadow-[var(--shadow-soft)] focus:outline-none focus:ring-2 focus:ring-brand-primary/30 focus:border-brand-primary sm:text-sm"
              showYearDropdown
              showMonthDropdown
              dropdownMode="select"
            />
          </div>
        </div>

        <Input
          label="Nombre del Team Leader"
          name="teamLeader"
          required
          value={formData.teamLeader}
          onChange={handleChange}
          placeholder="Ej: María González"
          icon={<Users size={18} />}
        />

      </form>
    </Modal>
  );
};

export default EditCollaboratorModal;
