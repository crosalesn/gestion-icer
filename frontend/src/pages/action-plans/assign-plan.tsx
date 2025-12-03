import { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import actionPlansService from '../../features/action-plans/services/action-plans-service';
import { ActionPlanType } from '../../features/action-plans/types/action-plan.types';
import type { AssignActionPlanPayload } from '../../features/action-plans/types/action-plan.types';
import Button from '../../shared/components/ui/button';
import Input from '../../shared/components/ui/input';
import { ArrowLeft, Save, AlertCircle } from 'lucide-react';

const AssignPlan = () => {
  const { collaboratorId } = useParams<{ collaboratorId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const collaboratorName = location.state?.collaboratorName || 'el Colaborador';

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Default due date: 30 days from now
  const defaultDate = new Date();
  defaultDate.setDate(defaultDate.getDate() + 30);
  const defaultDateString = defaultDate.toISOString().split('T')[0];

  const [formData, setFormData] = useState<AssignActionPlanPayload>({
    type: ActionPlanType.PD_30,
    description: '',
    dueDate: defaultDateString,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collaboratorId) return;

    setLoading(true);
    setError(null);

    try {
      await actionPlansService.assign(collaboratorId, formData);
      navigate(-1);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error al asignar el plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={20} />
        </Button>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">Asignar Plan de Acción</h1>
            <p className="text-sm text-gray-500">Para {collaboratorName}</p>
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

          <div>
            <label htmlFor="type" className="block text-sm font-medium text-gray-700">
              Tipo de Plan
            </label>
            <select
              id="type"
              name="type"
              required
              value={formData.type}
              onChange={handleChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value={ActionPlanType.PD_30}>PD-30 (Plan de Desarrollo 30 días)</option>
              <option value={ActionPlanType.PDF_30}>PDF-30 (Plan de Desarrollo Formativo 30 días)</option>
              <option value={ActionPlanType.SE_60}>SE-60 (Seguimiento Especial 60 días)</option>
            </select>
            <p className="mt-1 text-sm text-gray-500">
                PD-30: Riesgo Medio. PDF-30: Riesgo Alto (Técnico). SE-60: Riesgo Alto (Actitudinal).
            </p>
          </div>

          <div>
             <label htmlFor="description" className="block text-sm font-medium text-gray-700">
               Descripción / Objetivos
             </label>
             <textarea
               id="description"
               name="description"
               rows={4}
               required
               className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
               placeholder="Detalle las acciones a realizar..."
               value={formData.description}
               onChange={handleChange}
             />
          </div>

          <div>
            <Input
              id="dueDate"
              label="Fecha de Vencimiento"
              name="dueDate"
              type="date"
              required
              value={formData.dueDate}
              onChange={handleChange}
              className="mt-1"
            />
          </div>

          <div className="flex justify-end pt-4">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)} className="mr-3">
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Guardando...' : 'Asignar Plan'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AssignPlan;

