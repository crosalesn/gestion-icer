import { useState, useEffect } from 'react';
import type { Question, EvaluationTemplate, EvaluationAnswer } from '../../features/evaluations/types/template.types';
import { QuestionType, QuestionDimension } from '../../features/evaluations/types/template.types';
import Button from './ui/button';
import Input from './ui/input';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface DynamicEvaluationFormProps {
  template: EvaluationTemplate;
  initialAnswers?: EvaluationAnswer[];
  onSubmit: (answers: EvaluationAnswer[]) => Promise<void>;
  isLoading?: boolean;
  error?: string | null;
}

const DynamicEvaluationForm = ({
  template,
  initialAnswers = [],
  onSubmit,
  isLoading = false,
  error = null,
}: DynamicEvaluationFormProps) => {
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // Initialize answers from initialAnswers prop
    if (initialAnswers.length > 0) {
      const initialAnswersMap: Record<string, number | string> = {};
      initialAnswers.forEach((answer) => {
        initialAnswersMap[answer.questionId] = answer.value;
      });
      setAnswers(initialAnswersMap);
    }
  }, [initialAnswers]);

  const handleScaleAnswer = (questionId: string, value: number) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
    // Clear error for this question
    if (formErrors[questionId]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[questionId];
        return newErrors;
      });
    }
  };

  const handleTextAnswer = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }));
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    const sortedQuestions = [...template.questions].sort((a, b) => a.order - b.order);

    sortedQuestions.forEach((question) => {
      if (question.required) {
        const answer = answers[question.id];
        if (answer === undefined || answer === null || answer === '') {
          errors[question.id] = 'Esta pregunta es obligatoria';
        } else if (question.type === QuestionType.SCALE_1_4) {
          if (typeof answer !== 'number' || answer < 1 || answer > 4) {
            errors[question.id] = 'Debe seleccionar un valor entre 1 y 4';
          }
        }
      }
    });

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const answerArray: EvaluationAnswer[] = template.questions
      .filter((q) => answers[q.id] !== undefined)
      .map((q) => ({
        questionId: q.id,
        value: answers[q.id],
      }));

    await onSubmit(answerArray);
  };

  const getDimensionLabel = (dimension: QuestionDimension): string => {
    const labels: Record<QuestionDimension, string> = {
      [QuestionDimension.INTEGRATION]: 'Integración',
      [QuestionDimension.COMMUNICATION]: 'Comunicación',
      [QuestionDimension.ROLE_UNDERSTANDING]: 'Entendimiento del Rol',
      [QuestionDimension.PERFORMANCE]: 'Rendimiento',
    };
    return labels[dimension] || dimension;
  };

  const ratingLabels = [
    { value: 1, label: 'Insuficiente', colorClass: 'text-red-600 border-red-200 bg-red-50' },
    { value: 2, label: 'Básico', colorClass: 'text-orange-600 border-orange-200 bg-orange-50' },
    { value: 3, label: 'Adecuado', colorClass: 'text-green-600 border-green-200 bg-green-50' },
    { value: 4, label: 'Sobresaliente', colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  ];

  // Group questions by dimension
  const questionsByDimension = template.questions.reduce((acc, q) => {
    if (!acc[q.dimension]) {
      acc[q.dimension] = [];
    }
    acc[q.dimension].push(q);
    return acc;
  }, {} as Record<QuestionDimension, Question[]>);

  // Sort questions within each dimension by order
  Object.keys(questionsByDimension).forEach((dimension) => {
    questionsByDimension[dimension as QuestionDimension].sort((a, b) => a.order - b.order);
  });

  const sortedDimensions = Object.keys(questionsByDimension).sort((a, b) => {
    const firstQuestionA = questionsByDimension[a as QuestionDimension][0];
    const firstQuestionB = questionsByDimension[b as QuestionDimension][0];
    return firstQuestionA.order - firstQuestionB.order;
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {template.description && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">{template.description}</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertCircle className="text-red-600" size={20} />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {sortedDimensions.map((dimension) => {
        const dimensionQuestions = questionsByDimension[dimension as QuestionDimension];
        return (
          <div key={dimension} className="space-y-6">
            <h3 className="text-lg font-bold text-gray-800 pb-2 border-b border-gray-200">
              Dimensión: {getDimensionLabel(dimension as QuestionDimension)}
            </h3>
            <div className="space-y-8">
              {dimensionQuestions.map((question) => (
                <div key={question.id} className="space-y-3">
                  <label className="block text-base font-medium text-gray-900">
                    {question.text}
                    {question.required && <span className="text-red-500 ml-1">*</span>}
                  </label>

                  {question.type === QuestionType.SCALE_1_4 ? (
                    <div>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {ratingLabels.map((rating) => (
                          <button
                            key={rating.value}
                            type="button"
                            onClick={() => handleScaleAnswer(question.id, rating.value)}
                            className={`
                              py-3 px-2 rounded-lg border-2 transition-all
                              flex flex-col items-center justify-center gap-1
                              ${answers[question.id] === rating.value
                                ? rating.colorClass + ' ring-2 ring-offset-1 ring-blue-400 border-transparent'
                                : 'border-gray-200 hover:border-gray-300 text-gray-600 bg-white hover:bg-gray-50'}
                            `}
                          >
                            <span className="text-lg font-bold">{rating.value}</span>
                            <span className="text-xs font-medium uppercase text-center leading-tight">
                              {rating.label}
                            </span>
                          </button>
                        ))}
                      </div>
                      {formErrors[question.id] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[question.id]}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <textarea
                        value={(answers[question.id] as string) || ''}
                        onChange={(e) => handleTextAnswer(question.id, e.target.value)}
                        rows={4}
                        className={`
                          w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                          ${formErrors[question.id] ? 'border-red-500' : 'border-gray-300'}
                        `}
                        placeholder="Escribe tu respuesta aquí..."
                      />
                      {formErrors[question.id] && (
                        <p className="mt-1 text-sm text-red-600">{formErrors[question.id]}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      <div className="bg-gray-50 px-6 py-4 rounded-lg border-t border-gray-200 flex justify-end sticky bottom-0">
        <Button type="submit" disabled={isLoading} isLoading={isLoading} className="min-w-[200px]">
          {isLoading ? 'Enviando...' : 'Enviar Evaluación'}
          {!isLoading && <CheckCircle size={18} className="ml-2" />}
        </Button>
      </div>
    </form>
  );
};

export default DynamicEvaluationForm;


