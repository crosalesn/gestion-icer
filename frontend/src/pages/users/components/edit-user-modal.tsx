import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import usersService from '../../../features/users/services/users-service';
import type { User, UpdateUserPayload } from '../../../features/users/types/user.types';
import { UserRole } from '../../../features/users/types/user.types';
import Button from '../../../shared/components/ui/button';
import Input from '../../../shared/components/ui/input';
import Select from '../../../shared/components/ui/select';
import Modal from '../../../shared/components/ui/modal/modal';
import { User as UserIcon, Mail, Shield } from 'lucide-react';

interface EditUserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user: User;
}

const EditUserModal = ({ isOpen, onClose, onSuccess, user }: EditUserModalProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<UpdateUserPayload>({
    name: user.name,
    email: user.email,
    role: user.role,
    isActive: user.isActive,
  });

  useEffect(() => {
    if (isOpen) {
      setFormData({
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
      });
      setError(null);
    }
  }, [isOpen, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      await usersService.update(user.id, formData);
      toast.success(`Usuario ${formData.name} actualizado correctamente`);
      onSuccess();
      onClose();
    } catch (err: unknown) {
      const axiosError = err as { response?: { data?: { message?: string | string[] } } };
      const msg = Array.isArray(axiosError.response?.data?.message) 
        ? axiosError.response.data.message.join(', ') 
        : (axiosError.response?.data?.message || 'Error al actualizar el usuario');
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
      title="Editar Usuario"
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
      <form id="edit-user-form" onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="bg-red-50 text-red-700 p-3 rounded-xl text-sm border border-red-200">
            {error}
          </div>
        )}

        <Input
          id="name"
          label="Nombre Completo"
          name="name"
          required
          value={formData.name || ''}
          onChange={handleChange}
          placeholder="Ej: Juan Pérez"
          icon={<UserIcon size={18} />}
        />

        <Input
          id="email"
          label="Correo Electrónico"
          name="email"
          type="email"
          required
          value={formData.email || ''}
          onChange={handleChange}
          placeholder="juan.perez@icer.com"
          icon={<Mail size={18} />}
        />

        <Select
          id="role"
          name="role"
          label="Rol"
          required
          value={formData.role || UserRole.COLLABORATOR}
          onChange={handleChange}
          icon={<Shield size={18} />}
          options={[
            { value: UserRole.COLLABORATOR, label: 'Colaborador' },
            { value: UserRole.TEAM_LEADER, label: 'Team Leader' },
            { value: UserRole.SPECIALIST, label: 'Especialista' },
          ]}
        />

        <div className="flex items-center space-x-3 pt-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive ?? true}
              onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-brand-primary/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-primary"></div>
            <span className="ms-3 text-sm font-medium text-slate-700">
              {formData.isActive ? 'Usuario Activo' : 'Usuario Inactivo'}
            </span>
          </label>
        </div>
      </form>
    </Modal>
  );
};

export default EditUserModal;
