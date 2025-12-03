import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import usersService from '../../features/users/services/users-service';
import { UserRole } from '../../features/users/types/user.types';
import type { CreateUserPayload } from '../../features/users/types/user.types';
import Button from '../../shared/components/ui/button';
import Input from '../../shared/components/ui/input';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

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
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
            <ArrowLeft size={20} />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Registrar Usuario</h1>
            <p className="text-sm text-gray-500">Crea una nueva cuenta de acceso al sistema.</p>
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
                  <p className="text-sm text-green-700">Usuario creado exitosamente. Redirigiendo...</p>
                </div>
              </div>
            </div>
          )}

          <div>
            <Input
              id="name"
              label="Nombre Completo"
              name="name"
              type="text"
              required
              placeholder="Juan Pérez"
              value={formData.name}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <Input
              id="email"
              label="Correo Electrónico"
              name="email"
              type="email"
              required
              placeholder="ejemplo@icer.com"
              value={formData.email}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

           <div>
            <Input
              id="password"
              label="Contraseña Temporal"
              name="password"
              type="password"
              required
              placeholder="********"
              value={formData.password}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700">
              Rol
            </label>
            <select
              id="role"
              name="role"
              required
              value={formData.role}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value={UserRole.COLLABORATOR}>Colaborador</option>
              <option value={UserRole.TEAM_LEADER}>Team Leader</option>
              <option value={UserRole.SPECIALIST}>Especialista</option>
            </select>
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

