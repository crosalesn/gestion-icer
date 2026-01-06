import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { format, parseISO, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';
import reportsService from '../../features/reports/services/reports-service';
import evaluationsService from '../../features/evaluations/services/evaluations-service';
import type { CollaboratorHistory, Evaluation } from '../../features/reports/types/report.types';
import type { MilestoneResult } from '../../features/evaluations/types/milestone-result.types';
import type { CompletedAssignmentResponse } from '../../features/evaluations/types/template.types';
import { EvaluationMilestone } from '../../features/evaluations/types/template.types';
import Button from '../../shared/components/ui/button';
import MilestoneResults from '../evaluations/milestone-results';
import CompletedEvaluations from '../evaluations/completed-evaluations';
import { ArrowLeft, Target, Calendar, AlertCircle, CheckCircle, BarChart2, ListTodo, Clock } from 'lucide-react';
import { clsx } from 'clsx';
import { ProcessProgress } from './components/process-progress';

const CollaboratorDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [history, setHistory] = useState<CollaboratorHistory | null>(null);
  const [milestoneResults, setMilestoneResults] = useState<MilestoneResult[]>([]);
  const [completedAssignments, setCompletedAssignments] = useState<CompletedAssignmentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingResults, setLoadingResults] = useState(true);
  const [loadingCompleted, setLoadingCompleted] = useState(true);
  const [assigningEval, setAssigningEval] = useState(false);
  const [activeTab, setActiveTab] = useState<'results' | 'management'>('results');

  const fetchHistory = async () => {
    if (!id) return;
    try {
      const data = await reportsService.getCollaboratorHistory(id);
      setHistory(data);
    } catch (error) {
      console.error('Error fetching history:', error);
      toast.error('Error al cargar el historial del colaborador');
    } finally {
      setLoading(false);
    }
  };

  const fetchMilestoneResults = async () => {
    if (!id) return;
    try {
      const results = await evaluationsService.getCollaboratorResults(id);
      setMilestoneResults(results);
    } catch (error) {
      console.error('Error fetching milestone results:', error);
    } finally {
      setLoadingResults(false);
    }
  };

  const fetchCompletedAssignments = async () => {
    if (!id) return;
    try {
      const assignments = await evaluationsService.getCollaboratorCompletedAssignments(id);
      setCompletedAssignments(assignments);
    } catch (error) {
      console.error('Error fetching completed assignments:', error);
    } finally {
      setLoadingCompleted(false);
    }
  };

  useEffect(() => {
    fetchHistory();
    fetchMilestoneResults();
    fetchCompletedAssignments();
  }, [id]);

  const handleAssignEvaluation = async (milestone: EvaluationMilestone) => {
    if (!id) return;
    try {
      setAssigningEval(true);
      const assignments = await evaluationsService.assignEvaluation(id, milestone);
      const milestoneName = milestone === EvaluationMilestone.DAY_1 ? 'Día 1' :
                           milestone === EvaluationMilestone.WEEK_1 ? 'Semana 1' : 'Mes 1';
      toast.success(`Evaluación de ${milestoneName} asignada correctamente (${assignments.length} evaluación(es))`);
      await fetchHistory();
    } catch (error: any) {
      console.error('Error assigning evaluation:', error);
      toast.error(error.response?.data?.message || 'Error al asignar evaluación');
    } finally {
      setAssigningEval(false);
    }
  };

  const getDaysActive = (dateStr: string) => {
    try {
      if (!dateStr) return 0;
      return differenceInDays(new Date(), parseISO(dateStr));
    } catch {
      return 0;
    }
  };

  if (loading) return <div className="p-8 text-center">Cargando ficha del colaborador...</div>;
  if (!history) return <div className="p-8 text-center">Colaborador no encontrado</div>;

  const { collaborator, evaluations, activeActionPlan } = history;

  // Group evaluations by milestone for the management tab
  const evaluationsByMilestone = {
    DAY_1: evaluations.filter(e => e.type === 'DAY_1'),
    WEEK_1: evaluations.filter(e => e.type.includes('WEEK_1')),
    MONTH_1: evaluations.filter(e => e.type.includes('MONTH_1')),
  };

  const renderEvaluationCard = (milestoneTitle: string, milestone: EvaluationMilestone, evals: Evaluation[]) => {
    const isAssigned = evals.length > 0;
    const allCompleted = isAssigned && evals.every(e => e.status === 'COMPLETED');
    
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <h4 className="font-bold text-gray-800 flex items-center gap-2">
            {allCompleted ? <CheckCircle className="text-green-500" size={18} /> : 
             isAssigned ? <Clock className="text-blue-500" size={18} /> :
             <div className="w-4 h-4 rounded-full border-2 border-gray-300" />}
            {milestoneTitle}
          </h4>
          {!isAssigned && (
            <Button 
              variant="secondary" 
              className="text-xs py-1" 
              onClick={() => handleAssignEvaluation(milestone)}
              disabled={assigningEval}
            >
              + Iniciar Proceso
            </Button>
          )}
        </div>
        
        {isAssigned ? (
          <div className="space-y-3">
            {evals.map(evalItem => (
              <div key={evalItem.id} className="flex items-center justify-between bg-gray-50 p-3 rounded border border-gray-100">
                <div>
                  <p className="text-sm font-medium text-gray-700">
                    {evalItem.type === 'DAY_1' ? 'Evaluación Colaborador' :
                     evalItem.type.includes('COLLABORATOR') ? 'Autoevaluación' : 'Evaluación Team Leader'}
                  </p>
                  <p className="text-xs text-gray-500">
                    {evalItem.status === 'COMPLETED' && evalItem.completedAt ? 
                      `Completado el ${format(parseISO(evalItem.completedAt), 'dd/MM/yyyy')}` : 
                      'Pendiente'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  {evalItem.score && (
                    <span className={clsx(
                      "text-sm font-bold",
                      evalItem.score < 2 ? "text-red-600" : evalItem.score < 3 ? "text-amber-600" : "text-green-600"
                    )}>
                      {evalItem.score}
                    </span>
                  )}
                  {evalItem.status === 'PENDING' && (
                    <Button 
                      className="text-xs px-2 py-1 h-auto"
                      onClick={() => navigate(`/evaluaciones/${evalItem.id}`, { state: { evaluation: evalItem } })}
                    >
                      Evaluar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No asignado aún</p>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header / Info Card */}
      <div className="flex items-center gap-4">
        <button onClick={() => navigate('/colaboradores')} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft size={20} />
        </button>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">{collaborator.name}</h1>
            <p className="text-sm text-gray-500">{collaborator.role} • {collaborator.project}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Column 1: Profile & Status */}
        <div className="md:col-span-1 space-y-6">
            <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Estado Actual</h3>
                <div className="space-y-6">
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Progreso</label>
                      <ProcessProgress status={collaborator.status} />
                    </div>
                    
                    <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Riesgo Detectado</label>
                        <div>
                            <span className={clsx(
                                "px-3 py-1 rounded-full text-sm font-bold inline-flex items-center gap-1.5",
                                collaborator.riskLevel === 'HIGH' ? "bg-red-100 text-red-800" :
                                collaborator.riskLevel === 'MEDIUM' ? "bg-amber-100 text-amber-800" :
                                "bg-emerald-100 text-emerald-800"
                            )}>
                                {collaborator.riskLevel === 'HIGH' ? <AlertCircle size={14}/> : 
                                 collaborator.riskLevel === 'MEDIUM' ? <AlertCircle size={14}/> : <CheckCircle size={14}/>}
                                {collaborator.riskLevel === 'HIGH' ? 'ALTO' : collaborator.riskLevel === 'MEDIUM' ? 'MEDIO' : 'BAJO'}
                            </span>
                        </div>
                    </div>
                    
                    <div>
                         <label className="text-xs font-semibold text-gray-500 uppercase block mb-1">Tiempo en proceso</label>
                         <p className="text-gray-900 flex items-center gap-2 font-medium">
                            <Clock size={16} className="text-gray-400"/>
                            {getDaysActive(collaborator.admissionDate)} días
                         </p>
                         <p className="text-xs text-gray-500 mt-1 ml-6">
                           Ingreso: {format(parseISO(collaborator.admissionDate), 'dd/MM/yyyy')}
                         </p>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-100">
                      <label className="text-xs font-semibold text-gray-500 uppercase block mb-2">Plan de Acción / Seguimiento</label>
                      {activeActionPlan ? (
                           <div className="bg-blue-50 p-4 rounded-md border border-blue-100 shadow-sm">
                              <div className="flex justify-between items-start">
                                <h4 className="text-sm font-bold text-blue-900 flex items-center gap-2">
                                    <Target size={16} /> {activeActionPlan.type}
                                </h4>
                                <span className={clsx(
                                  "text-[10px] px-2 py-0.5 rounded-full font-bold",
                                  activeActionPlan.status === 'ACTIVE' ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                                )}>
                                  {activeActionPlan.status === 'ACTIVE' ? 'ACTIVO' : activeActionPlan.status}
                                </span>
                              </div>
                              
                              <p className="text-xs text-blue-700 mt-2 font-medium line-clamp-3 leading-relaxed">
                                {activeActionPlan.description}
                              </p>
                              
                              <div className="mt-3 flex items-center gap-2 text-xs text-blue-500 font-medium bg-blue-100/50 p-1.5 rounded">
                                <Calendar size={12} />
                                Vence: {format(parseISO(activeActionPlan.dueDate), 'dd/MM/yyyy')}
                              </div>
                              
                              <Button 
                                variant="outline" 
                                className="w-full mt-3 text-xs h-7 bg-white hover:bg-blue-50 border-blue-200 text-blue-700"
                                onClick={() => navigate(`/planes`)} // Navigate to plans list for now, ideally to plan detail
                              >
                                Ver Detalle
                              </Button>
                           </div>
                      ) : (
                          <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200">
                            <p className="text-xs text-gray-500 mb-3">No hay un plan activo asignado.</p>
                            <Button 
                                variant="outline" 
                                className="w-full text-xs justify-center"
                                onClick={() => navigate(`/planes/asignar/${id}`, { state: { collaboratorName: collaborator.name } })}
                            >
                                <Target size={14} className="mr-2"/> Asignar Manualmente
                            </Button>
                          </div>
                      )}
                    </div>
                </div>
            </div>
        </div>

        {/* Column 2 & 3: Tabs & Content */}
        <div className="md:col-span-2 space-y-6">
            {/* Tabs Navigation */}
            <div className="bg-white shadow rounded-lg px-4 py-2 flex gap-4">
              <button
                onClick={() => setActiveTab('results')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === 'results' 
                    ? "bg-brand-primary/10 text-brand-primary" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <BarChart2 size={18} />
                Resultados y Progreso
              </button>
              <button
                onClick={() => setActiveTab('management')}
                className={clsx(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  activeTab === 'management' 
                    ? "bg-brand-primary/10 text-brand-primary" 
                    : "text-gray-600 hover:bg-gray-50"
                )}
              >
                <ListTodo size={18} />
                Gestión de Evaluaciones
              </button>
            </div>

            {/* Tab Content */}
            {activeTab === 'results' ? (
              <div className="space-y-6">
                <MilestoneResults results={milestoneResults} loading={loadingResults} />
                <CompletedEvaluations evaluations={completedAssignments} loading={loadingCompleted} />
              </div>
            ) : (
              <div className="bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">Control de Hitos ICER</h3>
                
                <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-4 before:w-0.5 before:-translate-x-1/2 before:bg-gray-100 z-0">
                  {/* Day 1 */}
                  <div className="relative z-10 pl-10">
                     <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs border-4 border-white shadow-sm">
                       D1
                     </div>
                     {renderEvaluationCard('Hito Día 1', EvaluationMilestone.DAY_1, evaluationsByMilestone.DAY_1)}
                  </div>

                  {/* Week 1 */}
                  <div className="relative z-10 pl-10">
                     <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs border-4 border-white shadow-sm">
                       S1
                     </div>
                     {renderEvaluationCard('Hito Semana 1', EvaluationMilestone.WEEK_1, evaluationsByMilestone.WEEK_1)}
                  </div>

                  {/* Month 1 */}
                  <div className="relative z-10 pl-10">
                     <div className="absolute left-0 top-0 w-8 h-8 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center font-bold text-xs border-4 border-white shadow-sm">
                       M1
                     </div>
                     {renderEvaluationCard('Hito Mes 1', EvaluationMilestone.MONTH_1, evaluationsByMilestone.MONTH_1)}
                  </div>
                </div>
              </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorDetail;
