import { useState, useEffect } from 'react';
import { BookOpen, Users, AlertTriangle, CheckCircle, Target, MessageSquare, TrendingUp, Loader2 } from 'lucide-react';
import { clsx } from 'clsx';
import reportsService from '../../features/reports/services/reports-service';
import type { DashboardStats } from '../../features/reports/types/report.types';

const Home = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await reportsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="card-static relative overflow-hidden p-6 md:p-8 bg-gradient-to-r from-brand-primary to-brand-primary-strong text-white">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(238,114,28,0.35),transparent_40%)]" />
        
        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-1 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-sm font-semibold uppercase tracking-wide backdrop-blur-sm">
              <span className="w-2 h-2 rounded-full bg-brand-accent" />
              Metodología ICER
            </div>
            <h1 className="text-3xl md:text-4xl font-bold leading-tight">
              Seguimiento inteligente del talento con el sello WiTI
            </h1>
            <p className="text-white/85 max-w-2xl">
              Detecta riesgos temprano, entiende la experiencia de tus colaboradores y activa planes de acción con una UI clara y moderna.
            </p>
            <div className="flex flex-wrap gap-3">
              <div className="pill bg-white/20 text-white border border-white/30 backdrop-blur-sm">Escala 1 - 4</div>
              <div className="pill bg-white/20 text-white border border-white/30 backdrop-blur-sm">Planes guiados</div>
              <div className="pill bg-white/20 text-white border border-white/30 backdrop-blur-sm">Alertas tempranas</div>
            </div>
          </div>
          
          {/* Stats card with glass effect */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-4 md:p-6 border border-white/20 w-full lg:w-[360px] shadow-[0_8px_32px_rgba(0,0,0,0.2)]">
            <div className="flex items-center justify-between">
              <p className="text-sm uppercase tracking-wider text-white/80 font-semibold">Pulso actual</p>
              <BookOpen className="text-white/80" size={20} />
            </div>
            {loading ? (
              <div className="mt-4 flex items-center justify-center py-8">
                <Loader2 className="animate-spin text-white/70" size={32} />
              </div>
            ) : (
              <div className="mt-4 grid grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-white/70">Evaluaciones activas</p>
                  <p className="text-3xl font-bold text-white">{stats?.activeEvaluations ?? 0}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Planes de acción</p>
                  <p className="text-3xl font-bold text-white">{stats?.activeActionPlans ?? 0}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Riesgos altos</p>
                  <p className="text-3xl font-bold text-orange-200">{stats?.riskDistribution.high ?? 0}</p>
                </div>
                <div>
                  <p className="text-sm text-white/70">Score promedio</p>
                  <p className="text-3xl font-bold text-emerald-100">
                    {stats?.averageScore != null ? stats.averageScore.toFixed(1) : '—'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: AlertTriangle, title: 'Alertas tempranas', desc: 'Detecta riesgo por dimensión y momento' },
          { icon: Target, title: 'Planes guiados', desc: 'Activa planes 30/60 y mini fortalecimiento' },
          { icon: Users, title: 'Visión 360', desc: 'Cruza percepciones de colaboradores y TL' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="card p-5 flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary">
              <Icon size={18} />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-900">{title}</h3>
              <p className="text-sm text-slate-600">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Escala de Evaluación */}
      <div className="card p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-slate-900">Escala de Evaluación</h2>
          <div className="pill bg-brand-primary/10 text-brand-primary border border-brand-primary/20">1 a 4</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { value: 1, label: 'Insuficiente', color: 'red', description: 'No cumple con los estándares mínimos' },
            { value: 2, label: 'Básico', color: 'orange', description: 'Cumple con lo mínimo requerido' },
            { value: 3, label: 'Adecuado', color: 'green', description: 'Cumple con las expectativas' },
            { value: 4, label: 'Sobresaliente', color: 'emerald', description: 'Supera las expectativas' },
          ].map((item) => (
            <div
              key={item.value}
              className={clsx(
                "border-2 rounded-xl p-4 text-center",
                item.color === 'red' && 'border-red-300 bg-red-50',
                item.color === 'orange' && 'border-orange-300 bg-orange-50',
                item.color === 'green' && 'border-green-300 bg-green-50',
                item.color === 'emerald' && 'border-emerald-300 bg-emerald-50'
              )}
            >
              <div className={clsx(
                "text-4xl font-bold mb-2",
                item.color === 'red' && 'text-red-600',
                item.color === 'orange' && 'text-orange-600',
                item.color === 'green' && 'text-green-600',
                item.color === 'emerald' && 'text-emerald-600'
              )}>
                {item.value}
              </div>
              <div className={clsx(
                "font-semibold mb-1",
                item.color === 'red' && 'text-red-700',
                item.color === 'orange' && 'text-orange-700',
                item.color === 'green' && 'text-green-700',
                item.color === 'emerald' && 'text-emerald-700'
              )}>
                {item.label}
              </div>
              <div className="text-sm text-gray-600">{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dimensiones ICER */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Las 4 Dimensiones ICER</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              letter: 'I',
              name: 'Integración',
              icon: Users,
              color: 'blue',
              measures: 'Pertenencia, adaptación social',
              purpose: 'Detectar riesgo de rotación temprana',
              description: 'Evalúa qué tan integrado se siente el colaborador dentro del equipo, su nivel de adaptación social y la percepción de pertenencia al grupo de trabajo.'
            },
            {
              letter: 'C',
              name: 'Comunicación',
              icon: MessageSquare,
              color: 'purple',
              measures: 'Interacción, fluidez y claridad',
              purpose: 'Predecir autonomía y evitar errores',
              description: 'Mide la capacidad del colaborador para comunicarse efectivamente, su fluidez en la interacción con el equipo y la claridad en sus expresiones.'
            },
            {
              letter: 'E',
              name: 'Entendimiento del Rol',
              icon: Target,
              color: 'indigo',
              measures: 'Claridad del proyecto, funciones, habilidades',
              purpose: 'Aumentar desempeño y prioridades de aprendizaje',
              description: 'Evalúa la comprensión del colaborador sobre su rol, las funciones que debe desempeñar, los objetivos del proyecto y las habilidades necesarias.'
            },
            {
              letter: 'R',
              name: 'Rendimiento',
              icon: TrendingUp,
              color: 'green',
              measures: 'Motivación, carga, satisfacción y estabilidad',
              purpose: 'Definir planes de desarrollo y anticipar riesgos',
              description: 'Mide el nivel de motivación, la percepción de la carga de trabajo, la satisfacción laboral y la estabilidad del colaborador en su posición.'
            },
          ].map((dimension) => (
            <div
              key={dimension.letter}
              className={clsx(
                "border-2 rounded-xl p-5",
                dimension.color === 'blue' && 'border-blue-200 bg-blue-50',
                dimension.color === 'purple' && 'border-purple-200 bg-purple-50',
                dimension.color === 'indigo' && 'border-indigo-200 bg-indigo-50',
                dimension.color === 'green' && 'border-green-200 bg-green-50'
              )}
            >
              <div className="flex items-start gap-4">
                <div className={clsx(
                  "p-3 rounded-xl",
                  dimension.color === 'blue' && 'bg-blue-100',
                  dimension.color === 'purple' && 'bg-purple-100',
                  dimension.color === 'indigo' && 'bg-indigo-100',
                  dimension.color === 'green' && 'bg-green-100'
                )}>
                  <dimension.icon className={clsx(
                    dimension.color === 'blue' && 'text-blue-600',
                    dimension.color === 'purple' && 'text-purple-600',
                    dimension.color === 'indigo' && 'text-indigo-600',
                    dimension.color === 'green' && 'text-green-600'
                  )} size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={clsx(
                      "text-2xl font-bold",
                      dimension.color === 'blue' && 'text-blue-700',
                      dimension.color === 'purple' && 'text-purple-700',
                      dimension.color === 'indigo' && 'text-indigo-700',
                      dimension.color === 'green' && 'text-green-700'
                    )}>
                      {dimension.letter}
                    </span>
                    <h3 className="text-lg font-semibold text-gray-900">{dimension.name}</h3>
                  </div>
                  <p className="text-sm text-gray-700 mb-3">{dimension.description}</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-600">Mide:</span>
                      <span className="text-gray-700">{dimension.measures}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="font-medium text-gray-600">Propósito:</span>
                      <span className="text-gray-700">{dimension.purpose}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Momentos de Evaluación */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-6">Momentos de Evaluación</h2>
        <div className="space-y-6">
          {[
            {
              moment: 'Día 1',
              description: 'Evaluación inicial para detectar condiciones operativas y bloqueos críticos',
              focus: 'Integración operativa, comprensión del rol inicial, relación y cultura',
              calculation: 'ICER Colaborador',
              riskRanges: [
                { range: '1.0 - 1.9', level: 'Riesgo Alto', color: 'red', interpretation: 'No tuvo condiciones suficientes para un inicio adecuado' },
                { range: '2.0 - 2.9', level: 'Riesgo Medio', color: 'orange', interpretation: 'Inicio funcional con brechas importantes' },
                { range: '3.0 - 4.0', level: 'Riesgo Bajo', color: 'green', interpretation: 'Inicio adecuado sin señales de alerta' },
              ]
            },
            {
              moment: 'Semana 1',
              description: 'Evaluación de adaptación y primeros avances en el proyecto',
              focus: 'Integración y comunicación, conocimiento de procesos, ejecución inicial',
              calculation: 'ICER-C Semana 1 = (ICER Col × 0.6) + (ICER TL × 0.4)',
              riskRanges: [
                { range: '1.0 - 1.9', level: 'Riesgo Alto', color: 'red', interpretation: 'Señales claras de desadaptación operativa' },
                { range: '2.0 - 2.9', level: 'Riesgo Medio', color: 'orange', interpretation: 'Adaptación parcial con brechas importantes' },
                { range: '3.0 - 4.0', level: 'Riesgo Bajo', color: 'green', interpretation: 'Adaptación adecuada según lo esperado' },
              ]
            },
            {
              moment: 'Mes 1',
              description: 'Evaluación consolidada del primer mes de trabajo',
              focus: 'Integración consolidada, comunicación proactiva, entendimiento del rol, rendimiento y motivación',
              calculation: 'ICER-C Mes 1 = (ICER Col × 0.4) + (ICER TL × 0.6)',
              riskRanges: [
                { range: '1.0 - 1.9', level: 'Riesgo Alto', color: 'red', interpretation: 'Adaptación y desempeño inicial insuficiente' },
                { range: '2.0 - 2.9', level: 'Riesgo Medio', color: 'orange', interpretation: 'Adaptación parcial con brechas relevantes' },
                { range: '3.0 - 4.0', level: 'Riesgo Bajo', color: 'green', interpretation: 'Adaptación adecuada y desempeño alineado' },
              ]
            },
          ].map((evaluation) => (
            <div key={evaluation.moment} className="border border-gray-200 rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center flex-shrink-0 shadow-sm">
                  <span className="text-indigo-600 font-bold text-sm px-1 text-center">{evaluation.moment}</span>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Evaluación ICER - {evaluation.moment}</h3>
                  <p className="text-sm text-gray-600">{evaluation.description}</p>
                </div>
              </div>
              <div className="ml-16 space-y-2 text-sm text-gray-700">
                <div>
                  <span className="font-medium">Enfoque:</span> {evaluation.focus}
                </div>
                <div>
                  <span className="font-medium">Cálculo:</span> <code className="bg-gray-100 px-2 py-1 rounded-lg font-mono text-xs">{evaluation.calculation}</code>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {evaluation.riskRanges.map((risk) => (
                  <div
                    key={risk.range}
                    className={clsx(
                      "p-3 rounded-xl border-2",
                      risk.color === 'red' && 'border-red-300 bg-red-50',
                      risk.color === 'orange' && 'border-orange-300 bg-orange-50',
                      risk.color === 'green' && 'border-green-300 bg-green-50'
                    )}
                  >
                    <div className={clsx(
                      "font-semibold mb-1",
                      risk.color === 'red' && 'text-red-700',
                      risk.color === 'orange' && 'text-orange-700',
                      risk.color === 'green' && 'text-green-700'
                    )}>
                      {risk.level}
                    </div>
                    <div className="text-xs font-mono text-gray-600 mb-1">{risk.range}</div>
                    <div className="text-xs text-gray-700">{risk.interpretation}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Planes de Desarrollo */}
      <div className="card p-6">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Planes de Crecimiento</h2>
        <p className="text-slate-600 mb-6">
          Según el nivel de riesgo identificado, se asignan diferentes planes de desarrollo:
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              code: 'PD-30',
              name: 'Plan de Desarrollo 30 días',
              description: 'Intervención intensiva para corregir brechas críticas',
              color: 'red',
              actions: [
                'Activar Plan de Desarrollo 30 días',
                'Enfocar en máximo 2 brechas críticas',
                'Seguimiento semanal estructurado',
                'Alinear expectativas por escrito si es necesario'
              ]
            },
            {
              code: 'PDF-30',
              name: 'Mini Plan de Fortalecimiento 30 días',
              description: 'Refuerzo guiado para asegurar estabilidad y autonomía',
              color: 'orange',
              actions: [
                'Activar Mini Plan de Fortalecimiento',
                'Seguimiento cada 2 semanas',
                'Enfoque en 1 brecha técnica + 1 brecha conductual',
                'Revisar carga laboral y autonomía'
              ]
            },
            {
              code: 'SE-60',
              name: 'Seguimiento Estándar 60 días',
              description: 'Acompañamiento de crecimiento, certificaciones y proyección',
              color: 'green',
              actions: [
                'Seguimiento estándar 60 días',
                'Enfoque en crecimiento y certificaciones',
                'Identificar oportunidades comerciales',
                'Reforzar puntos fuertes observados'
              ]
            },
          ].map((plan) => (
            <div
              key={plan.code}
              className={clsx(
                "border-2 rounded-xl p-5",
                plan.color === 'red' && 'border-red-200 bg-red-50',
                plan.color === 'orange' && 'border-orange-200 bg-orange-50',
                plan.color === 'green' && 'border-green-200 bg-green-50'
              )}
            >
              <div className="mb-3">
                <div className={clsx(
                  "inline-block px-3 py-1 rounded text-sm font-bold mb-2",
                  plan.color === 'red' && 'bg-red-200 text-red-800',
                  plan.color === 'orange' && 'bg-orange-200 text-orange-800',
                  plan.color === 'green' && 'bg-green-200 text-green-800'
                )}>
                  {plan.code}
                </div>
                <h3 className={clsx(
                  "font-semibold text-lg mb-1",
                  plan.color === 'red' && 'text-red-900',
                  plan.color === 'orange' && 'text-orange-900',
                  plan.color === 'green' && 'text-green-900'
                )}>
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-700">{plan.description}</p>
              </div>
              <ul className="space-y-1 text-sm text-gray-700">
                {plan.actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className={clsx(
                      "mt-0.5 flex-shrink-0",
                      plan.color === 'red' && 'text-red-600',
                      plan.color === 'orange' && 'text-orange-600',
                      plan.color === 'green' && 'text-green-600'
                    )} size={16} />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen de Beneficios */}
      <div className="card bg-gradient-to-r from-brand-surface-strong via-white to-brand-surface-strong p-6 border border-[var(--color-border-subtle)]">
        <h2 className="text-xl font-semibold text-slate-900 mb-4">Beneficios de la Metodología ICER</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Detección Temprana de Riesgos</h3>
              <p className="text-sm text-gray-700">Identifica problemas de integración, comunicación o desempeño antes de que se conviertan en críticos.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Target className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Planes Personalizados</h3>
              <p className="text-sm text-gray-700">Cada colaborador recibe un plan de desarrollo adaptado a sus necesidades específicas.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <TrendingUp className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Mejora Continua</h3>
              <p className="text-sm text-gray-700">Evaluaciones periódicas permiten ajustar estrategias y medir el progreso.</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="text-indigo-600 mt-1 flex-shrink-0" size={20} />
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">Visión Integral</h3>
              <p className="text-sm text-gray-700">Considera tanto la perspectiva del colaborador como la del Team Leader para una evaluación completa.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
