import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import type { MilestoneResult } from '../../features/evaluations/types/milestone-result.types';
import { RiskLevel } from '../../features/evaluations/types/milestone-result.types';
import { EvaluationMilestone } from '../../features/evaluations/types/template.types';
import { TrendingUp, AlertTriangle, CheckCircle, Calculator } from 'lucide-react';
import { clsx } from 'clsx';

interface MilestoneResultsProps {
  results: MilestoneResult[];
  loading?: boolean;
}

const MilestoneResults = ({ results, loading }: MilestoneResultsProps) => {
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

  if (!results || results.length === 0) {
    return (
      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Resultados ICER</h3>
        <div className="text-center py-8 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <TrendingUp className="mx-auto mb-3 text-gray-400" size={32} />
          <p>No hay resultados de evaluación consolidados aún.</p>
          <p className="text-sm mt-1">Los resultados aparecerán cuando se completen las evaluaciones.</p>
        </div>
      </div>
    );
  }

  // Sort results by milestone order
  const milestoneOrder = {
    [EvaluationMilestone.DAY_1]: 1,
    [EvaluationMilestone.WEEK_1]: 2,
    [EvaluationMilestone.MONTH_1]: 3,
  };

  const sortedResults = [...results].sort((a, b) => 
    milestoneOrder[a.milestone] - milestoneOrder[b.milestone]
  );

  const getMilestoneLabel = (milestone: EvaluationMilestone): string => {
    const labels: Record<EvaluationMilestone, string> = {
      [EvaluationMilestone.DAY_1]: 'Día 1',
      [EvaluationMilestone.WEEK_1]: 'Semana 1',
      [EvaluationMilestone.MONTH_1]: 'Mes 1',
    };
    return labels[milestone] || milestone;
  };

  const getRiskLevelLabel = (level: RiskLevel): string => {
    const labels: Record<RiskLevel, string> = {
      [RiskLevel.HIGH]: 'Alto',
      [RiskLevel.MEDIUM]: 'Medio',
      [RiskLevel.LOW]: 'Bajo',
      [RiskLevel.NONE]: 'Sin clasificar',
    };
    return labels[level] || level;
  };

  const getRiskLevelColor = (level: RiskLevel) => {
    return {
      bg: level === RiskLevel.HIGH ? 'bg-red-100' :
          level === RiskLevel.MEDIUM ? 'bg-yellow-100' :
          level === RiskLevel.LOW ? 'bg-green-100' : 'bg-gray-100',
      text: level === RiskLevel.HIGH ? 'text-red-800' :
            level === RiskLevel.MEDIUM ? 'text-yellow-800' :
            level === RiskLevel.LOW ? 'text-green-800' : 'text-gray-800',
      border: level === RiskLevel.HIGH ? 'border-red-200' :
              level === RiskLevel.MEDIUM ? 'border-yellow-200' :
              level === RiskLevel.LOW ? 'border-green-200' : 'border-gray-200',
      icon: level === RiskLevel.HIGH ? AlertTriangle :
            level === RiskLevel.MEDIUM ? AlertTriangle :
            level === RiskLevel.LOW ? CheckCircle : CheckCircle,
    };
  };

  // Prepare data for chart
  const chartData = sortedResults.map((result) => ({
    name: getMilestoneLabel(result.milestone),
    puntaje: Number(result.finalScore.toFixed(1)),
    milestone: result.milestone,
  }));

  // Get the latest risk level
  const latestResult = sortedResults[sortedResults.length - 1];
  const currentRiskLevel = latestResult.riskLevel;
  const riskColors = getRiskLevelColor(currentRiskLevel);

  return (
    <div className="space-y-6">
      {/* Header with current status */}
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Resultados ICER Consolidados</h3>
            <p className="text-sm text-gray-500 mt-1">Evolución de puntajes a través de los hitos</p>
          </div>
          <div className={clsx(
            "px-4 py-2 rounded-lg border-2 flex items-center gap-2",
            riskColors.bg,
            riskColors.border
          )}>
            <riskColors.icon className={riskColors.text} size={20} />
            <div>
              <p className="text-xs font-medium text-gray-600">Nivel de Riesgo Actual</p>
              <p className={clsx("text-lg font-bold", riskColors.text)}>
                {getRiskLevelLabel(currentRiskLevel)}
              </p>
            </div>
          </div>
        </div>

        {/* Evolution Chart */}
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-700 mb-4">Evolución de Puntaje ICER</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis 
                dataKey="name" 
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <YAxis 
                domain={[1, 4]} 
                ticks={[1, 2, 3, 4]}
                stroke="#6b7280"
                style={{ fontSize: '12px' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  padding: '8px 12px'
                }}
                formatter={(value: number) => [value.toFixed(2), 'Puntaje']}
              />
              {/* Reference lines for risk levels */}
              <ReferenceLine y={2} stroke="#ef4444" strokeDasharray="3 3" label={{ value: 'Riesgo Alto', position: 'right', fill: '#ef4444', fontSize: 10 }} />
              <ReferenceLine y={3} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Riesgo Medio', position: 'right', fill: '#f59e0b', fontSize: 10 }} />
              <Line 
                type="monotone" 
                dataKey="puntaje" 
                stroke="#2563eb" 
                strokeWidth={3}
                dot={{ fill: '#2563eb', r: 6 }}
                activeDot={{ r: 8 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Timeline of results */}
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-gray-700">Detalle por Hito</h4>
          {sortedResults.map((result, index) => {
            const colors = getRiskLevelColor(result.riskLevel);
            const Icon = colors.icon;
            
            return (
              <div
                key={result.id}
                className={clsx(
                  "border-2 rounded-lg p-4 transition-all hover:shadow-md",
                  colors.border,
                  colors.bg
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <div className={clsx(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        colors.bg === 'bg-red-100' ? 'bg-red-200' :
                        colors.bg === 'bg-yellow-100' ? 'bg-yellow-200' :
                        colors.bg === 'bg-green-100' ? 'bg-green-200' : 'bg-gray-200'
                      )}>
                        <Icon className={colors.text} size={20} />
                      </div>
                      <div>
                        <h5 className="font-semibold text-gray-900">
                          {getMilestoneLabel(result.milestone)}
                        </h5>
                        <p className="text-xs text-gray-600">
                          {new Date(result.calculatedAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="ml-13 space-y-2">
                      <div className="flex items-center gap-2">
                        <Calculator size={16} className="text-gray-500" />
                        <code className="text-xs bg-white/50 px-2 py-1 rounded border border-gray-300">
                          {result.calculationFormula}
                        </code>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={clsx(
                      "text-3xl font-bold mb-1",
                      colors.text
                    )}>
                      {result.finalScore.toFixed(2)}
                    </div>
                    <div className={clsx(
                      "px-3 py-1 rounded-full text-xs font-semibold inline-block",
                      colors.bg === 'bg-red-100' ? 'bg-red-200 text-red-900' :
                      colors.bg === 'bg-yellow-100' ? 'bg-yellow-200 text-yellow-900' :
                      colors.bg === 'bg-green-100' ? 'bg-green-200 text-green-900' : 'bg-gray-200 text-gray-900'
                    )}>
                      Riesgo {getRiskLevelLabel(result.riskLevel)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MilestoneResults;

