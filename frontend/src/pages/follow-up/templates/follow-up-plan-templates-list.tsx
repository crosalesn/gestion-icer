import { useEffect, useState } from 'react';
import { Plus, FileText, Info, Calendar, Clock, AlertTriangle, Edit, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { clsx } from 'clsx';
import Button from '../../../shared/components/ui/button';
import { followUpPlanService } from '../../../features/follow-up/services/follow-up-plan.service';
import type { FollowUpPlanTemplate } from '../../../features/follow-up/types/follow-up-plan-template';
import { RiskLevel } from '../../../features/follow-up/types/follow-up-plan-template';
import Modal from '../../../shared/components/ui/modal/modal';
import Input from '../../../shared/components/ui/input';

const FollowUpPlanTemplatesList = () => {
  const [templates, setTemplates] = useState<FollowUpPlanTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<FollowUpPlanTemplate | null>(null);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    targetRiskLevel: RiskLevel.LOW,
    durationDays: 30,
    meetingFrequencyDays: 7,
    meetingCount: 4,
    description: '',
  });

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await followUpPlanService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error fetching templates:', error);
      toast.error('Error al cargar las plantillas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  const handleOpenModal = (template?: FollowUpPlanTemplate) => {
    if (template) {
      setEditingTemplate(template);
      setFormData({
        name: template.name,
        code: template.code,
        targetRiskLevel: template.targetRiskLevel,
        durationDays: template.durationDays,
        meetingFrequencyDays: template.meetingFrequencyDays,
        meetingCount: template.meetingCount,
        description: template.description || '',
      });
    } else {
      setEditingTemplate(null);
      setFormData({
        name: '',
        code: '',
        targetRiskLevel: RiskLevel.LOW,
        durationDays: 30,
        meetingFrequencyDays: 7,
        meetingCount: 4,
        description: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingTemplate) {
        await followUpPlanService.updateTemplate(editingTemplate.id, formData);
        toast.success('Plantilla actualizada correctamente');
      } else {
        await followUpPlanService.createTemplate(formData);
        toast.success('Plantilla creada correctamente');
      }
      setIsModalOpen(false);
      fetchTemplates();
    } catch (error) {
      console.error('Error saving template:', error);
      toast.error('Error al guardar la plantilla');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de eliminar esta plantilla? Esta acción no se puede deshacer.')) return;
    
    try {
      await followUpPlanService.deleteTemplate(id);
      toast.success('Plantilla eliminada correctamente');
      fetchTemplates();
    } catch (error) {
      console.error('Error deleting template:', error);
      toast.error('Error al eliminar la plantilla');
    }
  };

  const getRiskColor = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.HIGH: return 'bg-red-100 text-red-800 border-red-200';
      case RiskLevel.MEDIUM: return 'bg-orange-100 text-orange-800 border-orange-200';
      case RiskLevel.LOW: return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLabel = (risk: RiskLevel) => {
    switch (risk) {
      case RiskLevel.HIGH: return 'Riesgo Alto';
      case RiskLevel.MEDIUM: return 'Riesgo Medio';
      case RiskLevel.LOW: return 'Riesgo Bajo';
      default: return 'Sin Riesgo';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Planes de Seguimiento</h1>
          <p className="mt-1 text-sm text-gray-500">
            Gestiona las plantillas de planes de seguimiento según nivel de riesgo
          </p>
        </div>
        <Button onClick={() => handleOpenModal()}>
          <Plus size={20} className="mr-2" />
          Nueva Plantilla
        </Button>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Cargando plantillas...</div>
      ) : templates.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay plantillas definidas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Crea una nueva plantilla para comenzar a asignar planes.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className={clsx(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    getRiskColor(template.targetRiskLevel)
                  )}>
                    {getRiskLabel(template.targetRiskLevel)}
                  </span>
                  <div className="flex items-center gap-2">
                     <span className="text-xs text-gray-400 font-mono">{template.code}</span>
                  </div>
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">{template.name}</h3>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {template.description || 'Sin descripción'}
                </p>

                <div className="grid grid-cols-2 gap-3 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-gray-400" />
                    <span>{template.durationDays} días</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-gray-400" />
                    <span>{template.meetingCount} reuniones</span>
                  </div>
                  <div className="col-span-2 text-xs bg-gray-50 p-2 rounded border border-gray-100">
                    Frecuencia: Cada {template.meetingFrequencyDays} días
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 rounded-b-lg flex justify-end gap-2">
                <button 
                  onClick={() => handleOpenModal(template)}
                  className="p-1.5 text-gray-600 hover:text-brand-primary hover:bg-white rounded-md transition-all"
                  title="Editar plantilla"
                >
                  <Edit size={16} />
                </button>
                <button 
                  onClick={() => handleDelete(template.id)}
                  className="p-1.5 text-gray-600 hover:text-red-600 hover:bg-white rounded-md transition-all"
                  title="Eliminar plantilla"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTemplate ? "Editar Plantilla" : "Nueva Plantilla de Plan"}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nombre del Plan"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
            placeholder="Ej: Plan de Desarrollo 30 días"
          />
          <Input
            label="Código"
            value={formData.code}
            onChange={(e) => setFormData({...formData, code: e.target.value})}
            required
            placeholder="Ej: PD-30"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nivel de Riesgo Objetivo
            </label>
            <select
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2 border"
              value={formData.targetRiskLevel}
              onChange={(e) => setFormData({...formData, targetRiskLevel: e.target.value as RiskLevel})}
            >
              <option value={RiskLevel.HIGH}>Riesgo Alto (1.0 - 1.9)</option>
              <option value={RiskLevel.MEDIUM}>Riesgo Medio (2.0 - 2.9)</option>
              <option value={RiskLevel.LOW}>Riesgo Bajo (3.0 - 4.0)</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duración (días)"
              type="number"
              value={formData.durationDays}
              onChange={(e) => setFormData({...formData, durationDays: parseInt(e.target.value)})}
              required
              min={1}
            />
            <Input
              label="Cant. Reuniones"
              type="number"
              value={formData.meetingCount}
              onChange={(e) => setFormData({...formData, meetingCount: parseInt(e.target.value)})}
              required
              min={1}
            />
          </div>

          <Input
            label="Frecuencia (días entre reuniones)"
            type="number"
            value={formData.meetingFrequencyDays}
            onChange={(e) => setFormData({...formData, meetingFrequencyDays: parseInt(e.target.value)})}
            required
            min={1}
          />

          <div>
             <label className="block text-sm font-medium text-gray-700 mb-1">
              Descripción
            </label>
            <textarea
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-brand-primary focus:ring-brand-primary sm:text-sm p-2 border"
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" type="button" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">
              {editingTemplate ? 'Actualizar Plantilla' : 'Crear Plantilla'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default FollowUpPlanTemplatesList;

