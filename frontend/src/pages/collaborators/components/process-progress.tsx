import { CheckCircle } from 'lucide-react';
import { clsx } from 'clsx';

interface ProcessProgressProps {
  status: string;
}

const steps = [
  { id: 'PENDING_DAY_1', label: 'Día 1', short: 'D1' },
  { id: 'PENDING_WEEK_1', label: 'Semana 1', short: 'S1' },
  { id: 'PENDING_MONTH_1', label: 'Mes 1', short: 'M1' },
];

export const ProcessProgress = ({ status }: ProcessProgressProps) => {
  const getStepStatus = (stepId: string) => {
    // Map status to an order index
    const statusOrder: Record<string, number> = {
      'PENDING_DAY_1': 0,
      'PENDING_WEEK_1': 1,
      'PENDING_MONTH_1': 2,
      'FINISHED': 3
    };

    const currentStepIndex = statusOrder[status] ?? 0;
    const stepIndex = statusOrder[stepId];

    if (currentStepIndex > stepIndex) return 'completed';
    if (currentStepIndex === stepIndex) return 'current';
    return 'upcoming';
  };

  return (
    <div className="flex items-center gap-1">
      {steps.map((step, index) => {
        const stepStatus = getStepStatus(step.id);
        
        return (
          <div key={step.id} className="flex items-center">
            {/* Line connector */}
            {index > 0 && (
              <div className={clsx(
                "w-3 h-0.5 mx-0.5",
                stepStatus === 'completed' || (stepStatus === 'current' && getStepStatus(steps[index-1].id) === 'completed') 
                  ? "bg-brand-primary" 
                  : "bg-gray-200"
              )} />
            )}
            
            {/* Step circle */}
            <div 
              className={clsx(
                "flex items-center justify-center w-6 h-6 rounded-full text-[10px] font-bold border-2",
                stepStatus === 'completed' && "bg-brand-primary border-brand-primary text-white",
                stepStatus === 'current' && "bg-white border-brand-primary text-brand-primary",
                stepStatus === 'upcoming' && "bg-gray-50 border-gray-200 text-gray-400"
              )}
              title={`${step.label}: ${
                stepStatus === 'completed' ? 'Completado' : 
                stepStatus === 'current' ? 'En curso' : 'Pendiente'
              }`}
            >
              {stepStatus === 'completed' ? (
                <CheckCircle size={12} />
              ) : (
                <span>{step.short}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

