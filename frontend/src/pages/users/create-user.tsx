import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usersService from '../../features/users/services/users-service';
import { UserRole } from '../../features/users/types/user.types';
import type { CreateUserPayload } from '../../features/users/types/user.types';
import Button from '../../shared/components/ui/button';
import Input from '../../shared/components/ui/input';
import Select from '../../shared/components/ui/select';
import { ArrowLeft, Save, AlertCircle, User, Mail, Lock, Shield } from 'lucide-react';

const CreateUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  
  const [formData, setFormData] = useState<CreateUserPayload>({
    name: '',
    email: '',
    role: UserRole.COLLABORATOR,
    password: '', 
  });

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
    setSuccess(false);

    try {
      await usersService.create(formData);
      setSuccess(true);
      // Reset form or navigate away
      setTimeout(() => {
        navigate('/usuarios'); // Redirect to users list
      }, 2000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al crear el usuario');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <p className="pill bg-brand-primary/10 text-brand-primary border border-brand-primary/20 inline-block mb-1">Usuarios</p>
            <h1 className="text-2xl font-bold text-slate-900">Registrar Usuario</h1>
            <p className="text-sm text-slate-500">Crea una nueva cuenta de acceso al sistema.</p>
          </div>
        </div>
      </div>

      <div className="card p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
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
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <div className="flex">
                <div className="flex-shrink-0">
                  <Save className="h-5 w-5 text-green-400" aria-hidden="true" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">Usuario creado exitosamente. Redirigiendo...</p>
                </div>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input
              id="name"
              label="Nombre Completo"
              name="name"
              type="text"
              required
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={handleChange}
              icon={<User size={18} />}
            />

            <Input
              id="email"
              label="Correo Electrónico"
              name="email"
              type="email"
              required
              placeholder="ejemplo@icer.com"
              value={formData.email}
              onChange={handleChange}
              icon={<Mail size={18} />}
            />

            <Input
              id="password"
              label="Contraseña Temporal"
              name="password"
              type="password"
              required
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              icon={<Lock size={18} />}
            />

            <Select
              id="role"
              label="Rol"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              icon={<Shield size={18} />}
              options={[
                { value: UserRole.COLLABORATOR, label: 'Colaborador' },
                { value: UserRole.TEAM_LEADER, label: 'Team Leader' },
                { value: UserRole.SPECIALIST, label: 'Especialista' },
              ]}
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="mr-3">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Crear Usuario'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateUser;

