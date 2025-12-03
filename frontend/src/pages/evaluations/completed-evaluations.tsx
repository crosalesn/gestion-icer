import { useState } from 'react';
import type { CompletedAssignmentResponse } from '../../features/evaluations/types/template.types';
import { EvaluationMilestone, QuestionType } from '../../features/evaluations/types/template.types';
import { ChevronDown, ChevronUp, Calendar, CheckCircle2, FileText } from 'lucide-react';
import { clsx } from 'clsx';

interface CompletedEvaluationsProps {
  evaluations: CompletedAssignmentResponse[];
  loading?: boolean;
}

const CompletedEvaluations = ({ evaluations, loading }: CompletedEvaluationsProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
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

  const getScoreColor = (score: number | null): string => {
    if (score === null) return 'text-gray-500';
    if (score < 2) return 'text-red-600';
    if (score < 3) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getAnswerValue = (questionId: string, answers: Array<{ questionId: string; value: number | string }>): number | string | null => {
    const answer = answers.find((a) => a.questionId === questionId);
    return answer ? answer.value : null;
  };

  const getRatingLabel = (value: number): string => {
    const labels: Record<number, string> = {
      1: 'Insuficiente',
      2: 'Básico',
      3: 'Adecuado',
      4: 'Sobresaliente',
    };
    return labels[value] || String(value);
  };

  const getRatingColor = (value: number): string => {
    const colors: Record<number, string> = {
      1: 'text-red-600 bg-red-50 border-red-200',
      2: 'text-orange-600 bg-orange-50 border-orange-200',
      3: 'text-green-600 bg-green-50 border-green-200',
      4: 'text-emerald-600 bg-emerald-50 border-emerald-200',
    };
    return colors[value] || 'text-gray-600 bg-gray-50 border-gray-200';
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (!evaluations || evaluations.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Evaluaciones Completadas</h3>
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <FileText className="mx-auto mb-3 text-gray-400" size={32} />
          <p>No hay evaluaciones completadas aún.</p>
          <p className="text-sm mt-1">Las respuestas aparecerán aquí cuando se completen las evaluaciones.</p>
        </div>
      </div>
    );
  }

  // Group questions by dimension
  const groupQuestionsByDimension = (questions: any[]) => {
    const grouped: Record<string, any[]> = {};
    questions.forEach((q) => {
      const dim = q.dimension || 'General';
      if (!grouped[dim]) {
        grouped[dim] = [];
      }
      grouped[dim].push(q);
    });
    return grouped;
  };

  const getDimensionLabel = (dimension: string): string => {
    const labels: Record<string, string> = {
      INTEGRATION: 'Integración',
      COMMUNICATION: 'Comunicación',
      ROLE_UNDERSTANDING: 'Comprensión del Rol',
      PERFORMANCE: 'Desempeño',
    };
    return labels[dimension] || dimension;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h3 className="text-lg font-medium text-gray-900 mb-6">Evaluaciones Completadas</h3>
      
      <div className="space-y-4">
        {evaluations.map((evalItem) => {
          const isExpanded = expandedIds.has(evalItem.assignment.id);
          const answersMap = new Map(
            evalItem.assignment.answers.map((a) => [a.questionId, a.value])
          );
          const questionsByDimension = groupQuestionsByDimension(evalItem.template.questions);

          return (
            <div
              key={evalItem.assignment.id}
              className="border-2 rounded-xl transition-all duration-200 hover:shadow-md"
              style={{
                borderColor: isExpanded ? '#3b82f6' : '#e5e7eb',
              }}
            >
              {/* Header */}
              <div
                className="p-4 cursor-pointer"
                onClick={() => toggleExpand(evalItem.assignment.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <FileText className="text-blue-600" size={20} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 truncate">
                        {evalItem.template.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={clsx(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                            getMilestoneBadgeColor(evalItem.assignment.milestone)
                          )}
                        >
                          {getMilestoneLabel(evalItem.assignment.milestone)}
                        </span>
                        {evalItem.assignment.completedAt && (
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Calendar size={12} />
                            {formatDate(evalItem.assignment.completedAt)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    {evalItem.assignment.score !== null && (
                      <div className="text-right">
                        <div className="text-xs text-gray-500">Puntaje</div>
                        <div className={clsx('text-lg font-bold', getScoreColor(evalItem.assignment.score))}>
                          {evalItem.assignment.score.toFixed(1)}
                          <span className="text-xs text-gray-400 font-normal ml-1">/ 4.0</span>
                        </div>
                      </div>
                    )}
                    <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
                      {isExpanded ? (
                        <ChevronUp className="text-gray-500" size={20} />
                      ) : (
                        <ChevronDown className="text-gray-500" size={20} />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="border-t-2 border-gray-100 bg-gray-50/50 p-6">
                  <div className="space-y-6">
                    {Object.entries(questionsByDimension).map(([dimension, questions]) => (
                      <div key={dimension} className="space-y-4">
                        <h5 className="text-sm font-bold text-gray-700 uppercase tracking-wide border-b border-gray-200 pb-2">
                          {getDimensionLabel(dimension)}
                        </h5>
                        <div className="space-y-4 pl-2">
                          {questions
                            .sort((a, b) => a.order - b.order)
                            .map((question) => {
                              const answerValue = answersMap.get(question.id);
                              const hasAnswer = answerValue !== undefined && answerValue !== null;

                              return (
                                <div
                                  key={question.id}
                                  className="bg-white rounded-lg p-4 border border-gray-200"
                                >
                                  <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1">
                                      <p className="text-sm font-medium text-gray-900 mb-2">
                                        {question.text}
                                      </p>
                                      {hasAnswer ? (
                                        question.type === QuestionType.SCALE_1_4 ? (
                                          <div className="flex items-center gap-2">
                                            <span
                                              className={clsx(
                                                'inline-flex items-center justify-center w-10 h-10 rounded-lg border-2 font-bold text-sm',
                                                getRatingColor(answerValue as number)
                                              )}
                                            >
                                              {answerValue}
                                            </span>
                                            <span className="text-sm text-gray-600">
                                              {getRatingLabel(answerValue as number)}
                                            </span>
                                          </div>
                                        ) : (
                                          <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                            <p className="text-sm text-gray-700 whitespace-pre-wrap">
                                              {String(answerValue)}
                                            </p>
                                          </div>
                                        )
                                      ) : (
                                        <span className="text-xs text-gray-400 italic">
                                          Sin respuesta
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    ))}
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

export default CompletedEvaluations;

