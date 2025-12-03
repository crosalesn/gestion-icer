import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import collaboratorsService from '../../../features/collaborators/services/collaborators-service';
import type { Collaborator, UpdateCollaboratorPayload } from '../../../features/collaborators/types/collaborator.types';
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
  
  const [formData, setFormData] = useState<UpdateCollaboratorPayload>({
    name: collaborator.name,
    email: collaborator.email,
    role: collaborator.role,
    project: collaborator.project,
    admissionDate: collaborator.admissionDate.split('T')[0],
    teamLeader: collaborator.teamLeader,
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
      });
      setError(null);
    }
  }, [isOpen, collaborator]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await collaboratorsService.update(collaborator.id, formData);
      toast.success(`Colaborador ${formData.name} actualizado correctamente`);
      onSuccess();
      onClose();
    } catch (err: any) {
      const msg = Array.isArray(err.response?.data?.message) 
        ? err.response.data.message.join(', ') 
        : (err.response?.data?.message || 'Error al actualizar el colaborador');
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

