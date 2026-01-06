import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import evaluationsService from '../../features/evaluations/services/evaluations-service';
import { EvaluationType } from '../../features/evaluations/types/evaluation.types';
import type { Evaluation } from '../../features/evaluations/types/evaluation.types';
import { EVALUATION_QUESTIONS } from '../../features/evaluations/constants/questions';
import type { Question } from '../../features/evaluations/constants/questions';
import Button from '../../shared/components/ui/button';
import { ArrowLeft, CheckCircle, AlertCircle } from 'lucide-react';

const EvaluationForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [evaluation, setEvaluation] = useState<Evaluation | null>(location.state?.evaluation || null);
  const [loading, setLoading] = useState(!location.state?.evaluation);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvaluation = async () => {
      if (!evaluation && id) {
        try {
          const data = await evaluationsService.getById(id);
          setEvaluation(data);
        } catch (err) {
          console.error(err);
          setError("No se pudo cargar la información de la evaluación.");
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    
    fetchEvaluation();
  }, [id, evaluation]);

  const handleRatingChange = (questionId: string, rating: number) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: rating
    }));
  };

  const handleSubmit = async () => {
    if (!id || !evaluation) return;
    
    setSubmitting(true);
    try {
      await evaluationsService.submit(id, { answers });
      navigate(-1); // Go back to history or list
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || "Error al enviar la evaluación");
      setSubmitting(false);
    }
  };

  if (error) {
    return (
        <div className="p-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mb-4">
                <AlertCircle className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p className="text-gray-500 mb-6">{error}</p>
            <Button onClick={() => navigate('/colaboradores')}>
                Volver a Colaboradores
            </Button>
        </div>
    );
  }

  if (loading || !evaluation) {
     return <div className="p-8 text-center">Cargando evaluación...</div>;
  }

  const questions = EVALUATION_QUESTIONS[evaluation.type] || [];
  const allAnswered = questions.length > 0 && questions.every(q => answers[q.id]);

  // Group questions by category
  const questionsByCategory = questions.reduce((acc, q) => {
    const cat = q.category || 'General';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(q);
    return acc;
  }, {} as Record<string, Question[]>);

  const formatTitle = (type: EvaluationType) => {
    switch(type) {
        case EvaluationType.DAY_1: return 'Evaluación Día 1';
        case EvaluationType.WEEK_1_COLLABORATOR: return 'Evaluación Semana 1 (Colaborador)';
        case EvaluationType.WEEK_1_LEADER: return 'Evaluación Semana 1 (Líder)';
        case EvaluationType.MONTH_1_COLLABORATOR: return 'Evaluación Mes 1 (Colaborador)';
        case EvaluationType.MONTH_1_LEADER: return 'Evaluación Mes 1 (Líder)';
        default: return type;
    }
  };

  const ratingLabels = [
      { value: 1, label: 'Insuficiente', colorClass: 'text-red-600 border-red-200 bg-red-50' },
      { value: 2, label: 'Básico', colorClass: 'text-orange-600 border-orange-200 bg-orange-50' },
      { value: 3, label: 'Adecuado', colorClass: 'text-green-600 border-green-200 bg-green-50' },
      { value: 4, label: 'Sobresaliente', colorClass: 'text-emerald-600 border-emerald-200 bg-emerald-50' },
  ];

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-10">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={() => navigate(-1)} className="p-2">
          <ArrowLeft size={20} />
        </Button>
        <div>
            <h1 className="text-2xl font-bold text-gray-900">
                {formatTitle(evaluation.type)}
            </h1>
            <p className="text-sm text-gray-500">
                Responde con honestidad para un seguimiento efectivo.
            </p>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="p-6 space-y-8">
            {Object.entries(questionsByCategory).map(([category, categoryQuestions]) => (
                <div key={category}>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b border-gray-100">
                        Dimension: {category}
                    </h3>
                    <div className="space-y-8">
                        {categoryQuestions.map((q) => (
                            <div key={q.id} className="pb-2">
                                <p className="text-base font-medium text-gray-900 mb-4">
                                    {q.text}
                                </p>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {ratingLabels.map((rating) => (
                                        <button
                                            key={rating.value}
                                            type="button"
                                            onClick={() => handleRatingChange(q.id, rating.value)}
                                            className={`
                                                py-3 px-2 rounded-lg border-2 transition-all
                                                flex flex-col items-center justify-center gap-1
                                                ${answers[q.id] === rating.value 
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
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
        <div className="bg-gray-50 px-6 py-4 flex justify-end sticky bottom-0 border-t border-gray-200">
             <Button 
                onClick={handleSubmit} 
                disabled={!allAnswered || submitting}
                className="w-full sm:w-auto shadow-lg"
             >
                {submitting ? 'Enviando...' : 'Enviar Evaluación'}
                {!submitting && <CheckCircle size={18} className="ml-2" />}
             </Button>
        </div>
      </div>
    </div>
  );
};

export default EvaluationForm;
