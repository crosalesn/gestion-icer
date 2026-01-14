import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Target, Calendar, User, Clock, CheckCircle, XCircle } from 'lucide-react';
import actionPlansService from '../../features/action-plans/services/action-plans-service';
import { formatDate } from '../../shared/utils/date-utils';
import collaboratorsService from '../../features/collaborators/services/collaborators-service';
import type { ActionPlan } from '../../features/action-plans/types/action-plan.types';
import type { Collaborator } from '../../features/collaborators/types/collaborator.types';
import Button from '../../shared/components/ui/button';

const ActionPlansList = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState<ActionPlan[]>([]);
  const [collaborators, setCollaborators] = useState<Record<string, Collaborator>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [plansData, collaboratorsData] = await Promise.all([
          actionPlansService.getAll(),
          collaboratorsService.getAll()
        ]);

        setPlans(plansData);
        
        // Create a map of collaborators for easy lookup
        const collMap: Record<string, Collaborator> = {};
        collaboratorsData.forEach(c => {
          collMap[c.id] = c;
        });
        setCollaborators(collMap);

      } catch (error) {
        console.error('Error fetching action plans:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"><CheckCircle size={12} /> Activo</span>;
      case 'COMPLETED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"><CheckCircle size={12} /> Completado</span>;
      case 'CANCELLED':
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"><XCircle size={12} /> Cancelado</span>;
      default:
        return <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>;
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Cargando planes de acción...</div>;
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Planes de Acción Activos</h1>
            <p className="mt-1 text-sm text-gray-500">
              Seguimiento de planes de mejora asignados a colaboradores.
            </p>
          </div>
        </div>

        {plans.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-12 text-center">
              <div className="mx-auto h-12 w-12 text-gray-400">
              <Target size={48} />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay planes activos</h3>
              <p className="mt-1 text-sm text-gray-500">
                  Los planes de acción se generan automáticamente según el riesgo detectado en las evaluaciones.
              </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {plans.map((plan) => {
              const collaborator = collaborators[plan.collaboratorId];
              return (
                <div key={plan.id} className="bg-white shadow rounded-lg p-6 border-l-4 border-brand-primary hover:shadow-md transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between md:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        {getStatusBadge(plan.status)}
                        <span className="text-xs text-gray-400 font-mono">ID: {String(plan.id || '').slice(0, 8)}</span>
                      </div>
                      
                      <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                         {plan.type}
                      </h3>
                      
                      <p className="text-sm text-gray-600 mt-2 mb-4 line-clamp-2">
                        {plan.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="font-medium text-gray-900">{collaborator ? collaborator.name : 'Desconocido'}</span>
                        </div>
                         <div className="flex items-center gap-2">
                          <Clock size={16} className="text-gray-400" />
                          <span>Asignado: {formatDate(plan.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-brand-primary font-medium">
                          <Calendar size={16} />
                          <span>Vence: {formatDate(plan.dueDate)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 min-w-[150px]">
                      <Button 
                        variant="outline" 
                        className="w-full text-xs"
                        onClick={() => navigate(`/colaboradores/${plan.collaboratorId}`)}
                      >
                        Ver Colaborador
                      </Button>
                      {/* Future: Add button to view plan details / edit progress */}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
    </div>
  );
};

export default ActionPlansList;
