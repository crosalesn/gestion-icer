import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Plus, Edit, ToggleLeft, ToggleRight, FileText, Info } from 'lucide-react';
import { clsx } from 'clsx';
import Button from '../../shared/components/ui/button';
import templateService from '../../features/evaluations/services/template-service';
import type { EvaluationTemplate } from '../../features/evaluations/types/template.types';
import { EvaluationMilestone, TargetRole } from '../../features/evaluations/types/template.types';

const TemplatesList = () => {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<EvaluationTemplate[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const data = await templateService.getAll();
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

  const handleToggleStatus = async (template: EvaluationTemplate) => {
    try {
      await templateService.update(template.id, { isActive: !template.isActive });
      toast.success(`Plantilla ${!template.isActive ? 'activada' : 'desactivada'} correctamente`);
      fetchTemplates();
    } catch (error) {
      console.error('Error updating template status:', error);
      toast.error('Error al actualizar el estado de la plantilla');
    }
  };

  const getMilestoneLabel = (milestone: EvaluationMilestone) => {
    switch (milestone) {
      case EvaluationMilestone.DAY_1: return 'Día 1';
      case EvaluationMilestone.WEEK_1: return 'Semana 1';
      case EvaluationMilestone.MONTH_1: return 'Mes 1';
      default: return milestone;
    }
  };

  const getRoleLabel = (role: TargetRole) => {
    switch (role) {
      case TargetRole.COLLABORATOR: return 'Colaborador';
      case TargetRole.TEAM_LEADER: return 'Team Leader';
      default: return role;
    }
  };

  const getMilestoneBadgeColor = (milestone: EvaluationMilestone) => {
    switch (milestone) {
      case EvaluationMilestone.DAY_1: return 'bg-blue-100 text-blue-800 border-blue-200';
      case EvaluationMilestone.WEEK_1: return 'bg-indigo-100 text-indigo-800 border-indigo-200';
      case EvaluationMilestone.MONTH_1: return 'bg-purple-100 text-purple-800 border-purple-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Evaluaciones</h1>
          <p className="mt-1 text-sm text-gray-500">
            Administra las plantillas y preguntas para cada hito del proceso ICER
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => navigate('/evaluaciones/plantillas/nueva')}>
            <Plus size={20} className="mr-2" />
            Nueva Plantilla
          </Button>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3">
        <Info className="text-blue-600 mt-0.5" size={20} />
        <div>
          <h4 className="text-sm font-medium text-blue-900">Sobre las Plantillas Activas</h4>
          <p className="text-sm text-blue-700 mt-1">
            Solo puede haber una plantilla activa por combinación de Hito y Rol. Al activar una plantilla, se desactivarán automáticamente otras que entren en conflicto.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-500">Cargando plantillas...</div>
      ) : templates.length === 0 ? (
        <div className="bg-white shadow rounded-lg p-8 text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">No hay plantillas</h3>
          <p className="mt-1 text-sm text-gray-500">
            Comienza creando una nueva plantilla o restaura las plantillas base.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <div 
              key={template.id} 
              className={clsx(
                "bg-white rounded-lg shadow-sm border transition-shadow hover:shadow-md flex flex-col",
                template.isActive ? "border-brand-primary/30 ring-1 ring-brand-primary/10" : "border-gray-200 opacity-75 hover:opacity-100"
              )}
            >
              <div className="p-5 flex-1">
                <div className="flex justify-between items-start mb-3">
                  <span className={clsx(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    getMilestoneBadgeColor(template.milestone)
                  )}>
                    {getMilestoneLabel(template.milestone)}
                  </span>
                  {template.isActive ? (
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                  ) : (
                    <span className="h-2 w-2 rounded-full bg-gray-300"></span>
                  )}
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-1">{template.title}</h3>
                <p className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wide">
                  {getRoleLabel(template.targetRole)}
                </p>
                
                <p className="text-sm text-gray-600 line-clamp-2 mb-4">
                  {template.description || 'Sin descripción'}
                </p>

                <div className="flex items-center gap-2 text-xs text-gray-500 mt-auto">
                  <span className="bg-gray-100 px-2 py-1 rounded">
                    v{template.version}
                  </span>
                  <span>•</span>
                  <span>{template.questions.length} preguntas</span>
                </div>
              </div>

              <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 rounded-b-lg flex justify-between items-center">
                <button 
                  onClick={() => handleToggleStatus(template)}
                  className={clsx(
                    "text-sm font-medium flex items-center gap-1.5 transition-colors",
                    template.isActive ? "text-green-700 hover:text-green-800" : "text-gray-500 hover:text-gray-700"
                  )}
                  title={template.isActive ? "Desactivar plantilla" : "Activar plantilla"}
                >
                  {template.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                  {template.isActive ? 'Activa' : 'Inactiva'}
                </button>

                <div className="flex gap-2">
                  <button 
                    onClick={() => navigate(`/evaluaciones/plantillas/${template.id}`)}
                    className="p-1.5 text-gray-600 hover:text-brand-primary hover:bg-white rounded-md transition-all"
                    title="Editar plantilla"
                  >
                    <Edit size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TemplatesList;

