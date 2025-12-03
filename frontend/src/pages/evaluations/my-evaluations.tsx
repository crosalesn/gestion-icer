import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../app/store';
import { fetchPendingEvaluations, submitEvaluation } from '../../features/evaluations/store/evaluations-slice';
import type { PendingEvaluationResponse, EvaluationAnswer } from '../../features/evaluations/types/template.types';
import { EvaluationMilestone } from '../../features/evaluations/types/template.types';
import DynamicEvaluationForm from '../../shared/components/dynamic-evaluation-form';
import Button from '../../shared/components/ui/button';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  User, 
  FileText, 
  Calendar,
  ChevronDown,
  ChevronUp,
  Sparkles
} from 'lucide-react';

const MyEvaluations = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pendingEvaluations, loading, error, submitting, submitError } = useSelector(
    (state: RootState) => state.evaluations
  );
  const [selectedEvaluation, setSelectedEvaluation] = useState<PendingEvaluationResponse | null>(null);
  const [isExpanded, setIsExpanded] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(fetchPendingEvaluations());
  }, [dispatch]);

  const handleStartEvaluation = (evaluation: PendingEvaluationResponse) => {
    const assignmentId = evaluation.assignment?.id;
    
    if (!assignmentId) {
      alert('Error: No se pudo obtener el ID de la evaluación. Por favor recarga la página.');
      return;
    }
    
    setSelectedEvaluation(evaluation);
    setIsExpanded((prev) => ({
      ...prev,
      [assignmentId]: true,
    }));
  };

  const handleSubmit = async (answers: EvaluationAnswer[]) => {
    if (!selectedEvaluation) return;

    const result = await dispatch(
      submitEvaluation({
        assignmentId: selectedEvaluation.assignment.id,
        answers,
      })
    );

    if (submitEvaluation.fulfilled.match(result)) {
      // Reload pending evaluations
      dispatch(fetchPendingEvaluations());
      setSelectedEvaluation(null);
      setIsExpanded((prev) => {
        const newState = { ...prev };
        delete newState[selectedEvaluation.assignment.id];
        return newState;
      });
    }
  };

  const getMilestoneLabel = (milestone: EvaluationMilestone): string => {
    const labels: Record<EvaluationMilestone, string> = {
      [EvaluationMilestone.DAY_1]: 'Día 1',
      [EvaluationMilestone.WEEK_1]: 'Semana 1',
      [EvaluationMilestone.MONTH_1]: 'Mes 1',
    };
    return labels[milestone] || milestone;
  };

  const getMilestoneBadgeColor = (milestone: EvaluationMilestone): string => {
    const colors: Record<EvaluationMilestone, string> = {
      [EvaluationMilestone.DAY_1]: 'bg-blue-100 text-blue-700 border-blue-200',
      [EvaluationMilestone.WEEK_1]: 'bg-purple-100 text-purple-700 border-purple-200',
      [EvaluationMilestone.MONTH_1]: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    };
    return colors[milestone] || 'bg-gray-100 text-gray-700 border-gray-200';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const getDaysUntilDue = (dueDate: string): number => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-brand-primary/20 border-t-brand-primary mx-auto mb-6"></div>
            <Sparkles className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-brand-primary" size={24} />
          </div>
          <p className="text-gray-600 text-lg font-medium">Cargando evaluaciones pendientes...</p>
          <p className="text-gray-400 text-sm mt-2">Por favor espera un momento</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-50 mb-6 ring-4 ring-red-100">
            <AlertCircle className="text-red-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error al cargar</h2>
          <p className="text-gray-600 mb-8">{error}</p>
          <Button 
            onClick={() => dispatch(fetchPendingEvaluations())}
            variant="primary"
            className="px-6 py-3"
          >
            Reintentar
          </Button>
        </div>
      </div>
    );
  }

  if (pendingEvaluations.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-center max-w-md">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-green-50 to-emerald-50 mb-6 ring-4 ring-green-100">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¡Todo al día!</h2>
          <p className="text-gray-600 text-lg mb-2">No hay evaluaciones pendientes en este momento.</p>
          <p className="text-sm text-gray-400">
            Las evaluaciones aparecerán aquí cuando se creen colaboradores.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-8">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="p-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg">
            <FileText className="text-white" size={24} />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Evaluaciones Pendientes</h1>
            <p className="text-gray-500 mt-1 flex items-center gap-2">
              <Clock size={16} />
              {pendingEvaluations.length} evaluación{pendingEvaluations.length !== 1 ? 'es' : ''} pendiente{pendingEvaluations.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      </div>

      {/* Evaluations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {pendingEvaluations.map((evalItem) => {
          const assignmentId = evalItem.assignment?.id;
          
          if (!assignmentId) {
            return null;
          }
          
          const isExpanding = isExpanded[assignmentId] || false;
          const milestone = evalItem.assignment?.milestone;
          const dueDate = evalItem.assignment?.dueDate;
          const daysUntilDue = dueDate ? getDaysUntilDue(dueDate) : null;
          const isOverdue = daysUntilDue !== null && daysUntilDue < 0;
          const isUrgent = daysUntilDue !== null && daysUntilDue <= 2 && daysUntilDue >= 0;

          return (
            <div
              key={assignmentId}
              className={`bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                isExpanding 
                  ? 'border-blue-400 shadow-blue-100' 
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                        {(evalItem.collaboratorName || 'C').charAt(0).toUpperCase()}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 shadow-sm">
                        <User className="text-blue-600" size={12} />
                      </div>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 truncate">
                        {evalItem.collaboratorName || 'Colaborador'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2 truncate">
                        {evalItem.collaboratorProject || 'Proyecto'}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        {milestone && (
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border ${getMilestoneBadgeColor(milestone)}`}>
                            <Calendar size={12} />
                            {getMilestoneLabel(milestone)}
                          </span>
                        )}
                        {isOverdue && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700 border border-red-200">
                            <AlertCircle size={12} />
                            Vencida
                          </span>
                        )}
                        {isUrgent && !isOverdue && (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700 border border-orange-200">
                            <Clock size={12} />
                            Urgente
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expand/Collapse Button */}
                  <button
                    onClick={() => {
                      if (isExpanding) {
                        setIsExpanded((prev) => {
                          const newState = { ...prev };
                          delete newState[assignmentId];
                          return newState;
                        });
                        setSelectedEvaluation(null);
                      } else {
                        handleStartEvaluation(evalItem);
                      }
                    }}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {isExpanding ? (
                      <ChevronUp className="text-gray-500" size={20} />
                    ) : (
                      <ChevronDown className="text-gray-500" size={20} />
                    )}
                  </button>
                </div>

                {/* Template Title */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <FileText size={16} className="text-blue-600" />
                    <span className="font-medium">{evalItem.template?.title || 'Evaluación ICER'}</span>
                  </div>
                </div>

                {/* Due Date */}
                {dueDate && (
                  <div className="flex items-center gap-2 text-sm mb-4">
                    <Clock size={14} className={`${isOverdue ? 'text-red-500' : isUrgent ? 'text-orange-500' : 'text-gray-400'}`} />
                    <span className={`font-medium ${isOverdue ? 'text-red-600' : isUrgent ? 'text-orange-600' : 'text-gray-600'}`}>
                      Vence: {formatDate(dueDate)}
                      {daysUntilDue !== null && (
                        <span className="ml-2">
                          ({isOverdue 
                            ? `Hace ${Math.abs(daysUntilDue)} día${Math.abs(daysUntilDue) !== 1 ? 's' : ''}`
                            : daysUntilDue === 0 
                            ? 'Hoy'
                            : `En ${daysUntilDue} día${daysUntilDue !== 1 ? 's' : ''}`
                          })
                        </span>
                      )}
                    </span>
                  </div>
                )}

                {/* Action Button */}
                {!isExpanding && (
                  <Button
                    onClick={() => handleStartEvaluation(evalItem)}
                    variant="primary"
                    fullWidth
                    className="py-3 text-base font-semibold shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  >
                    <FileText size={18} className="mr-2" />
                    Comenzar Evaluación
                  </Button>
                )}
              </div>

              {/* Expanded Form */}
              {isExpanding && evalItem.template && (
                <div className="border-t-2 border-gray-100 bg-gray-50/50">
                  <div className="p-6">
                    <DynamicEvaluationForm
                      template={evalItem.template}
                      initialAnswers={evalItem.assignment?.answers || []}
                      onSubmit={handleSubmit}
                      isLoading={submitting}
                      error={submitError}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyEvaluations;

