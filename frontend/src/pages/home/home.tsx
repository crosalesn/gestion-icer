import { BookOpen, Users, AlertTriangle, CheckCircle, Target, MessageSquare, TrendingUp } from 'lucide-react';

const Home = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Metodología ICER</h1>
        <p className="mt-2 text-gray-600">
          Sistema de evaluación integral para el seguimiento y desarrollo de colaboradores
        </p>
      </div>

      {/* Introducción */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
        <div className="flex items-start gap-4">
          <BookOpen className="text-blue-600 mt-1 flex-shrink-0" size={24} />
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">¿Qué es ICER?</h2>
            <p className="text-gray-700 leading-relaxed">
              ICER es una metodología de evaluación que utiliza una escala del 1 al 4 para medir cuatro dimensiones clave 
              en el desempeño y adaptación de los colaboradores. Esta herramienta permite detectar riesgos tempranos, 
              predecir autonomía y definir planes de desarrollo personalizados.
            </p>
          </div>
        </div>
      </div>

      {/* Escala de Evaluación */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Escala de Evaluación</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            { value: 1, label: 'Insuficiente', color: 'red', description: 'No cumple con los estándares mínimos' },
            { value: 2, label: 'Básico', color: 'orange', description: 'Cumple con lo mínimo requerido' },
            { value: 3, label: 'Adecuado', color: 'green', description: 'Cumple con las expectativas' },
            { value: 4, label: 'Sobresaliente', color: 'emerald', description: 'Supera las expectativas' },
          ].map((item) => (
            <div
              key={item.value}
              className={`border-2 rounded-lg p-4 text-center ${
                item.color === 'red' ? 'border-red-300 bg-red-50' :
                item.color === 'orange' ? 'border-orange-300 bg-orange-50' :
                item.color === 'green' ? 'border-green-300 bg-green-50' :
                'border-emerald-300 bg-emerald-50'
              }`}
            >
              <div className={`text-4xl font-bold mb-2 ${
                item.color === 'red' ? 'text-red-600' :
                item.color === 'orange' ? 'text-orange-600' :
                item.color === 'green' ? 'text-green-600' :
                'text-emerald-600'
              }`}>
                {item.value}
              </div>
              <div className={`font-semibold mb-1 ${
                item.color === 'red' ? 'text-red-700' :
                item.color === 'orange' ? 'text-orange-700' :
                item.color === 'green' ? 'text-green-700' :
                'text-emerald-700'
              }`}>
                {item.label}
              </div>
              <div className="text-sm text-gray-600">{item.description}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Dimensiones ICER */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Las 4 Dimensiones ICER</h2>
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
              className={`border-2 rounded-lg p-5 hover:shadow-md transition-shadow ${
                dimension.color === 'blue' ? 'border-blue-200 bg-blue-50' :
                dimension.color === 'purple' ? 'border-purple-200 bg-purple-50' :
                dimension.color === 'indigo' ? 'border-indigo-200 bg-indigo-50' :
                'border-green-200 bg-green-50'
              }`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg ${
                  dimension.color === 'blue' ? 'bg-blue-100' :
                  dimension.color === 'purple' ? 'bg-purple-100' :
                  dimension.color === 'indigo' ? 'bg-indigo-100' :
                  'bg-green-100'
                }`}>
                  <dimension.icon className={
                    dimension.color === 'blue' ? 'text-blue-600' :
                    dimension.color === 'purple' ? 'text-purple-600' :
                    dimension.color === 'indigo' ? 'text-indigo-600' :
                    'text-green-600'
                  } size={24} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-2xl font-bold ${
                      dimension.color === 'blue' ? 'text-blue-700' :
                      dimension.color === 'purple' ? 'text-purple-700' :
                      dimension.color === 'indigo' ? 'text-indigo-700' :
                      'text-green-700'
                    }`}>
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Momentos de Evaluación</h2>
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
            <div key={evaluation.moment} className="border border-gray-200 rounded-lg p-5">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
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
                  <span className="font-medium">Cálculo:</span> <code className="bg-gray-100 px-2 py-1 rounded">{evaluation.calculation}</code>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                {evaluation.riskRanges.map((risk) => (
                  <div
                    key={risk.range}
                    className={`p-3 rounded border-2 ${
                      risk.color === 'red' ? 'border-red-300 bg-red-50' :
                      risk.color === 'orange' ? 'border-orange-300 bg-orange-50' :
                      'border-green-300 bg-green-50'
                    }`}
                  >
                    <div className={`font-semibold mb-1 ${
                      risk.color === 'red' ? 'text-red-700' :
                      risk.color === 'orange' ? 'text-orange-700' :
                      'text-green-700'
                    }`}>
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
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Planes de Crecimiento</h2>
        <p className="text-gray-600 mb-6">
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
              className={`border-2 rounded-lg p-5 ${
                plan.color === 'red' ? 'border-red-200 bg-red-50' :
                plan.color === 'orange' ? 'border-orange-200 bg-orange-50' :
                'border-green-200 bg-green-50'
              }`}
            >
              <div className="mb-3">
                <div className={`inline-block px-3 py-1 rounded text-sm font-bold mb-2 ${
                  plan.color === 'red' ? 'bg-red-200 text-red-800' :
                  plan.color === 'orange' ? 'bg-orange-200 text-orange-800' :
                  'bg-green-200 text-green-800'
                }`}>
                  {plan.code}
                </div>
                <h3 className={`font-semibold text-lg mb-1 ${
                  plan.color === 'red' ? 'text-red-900' :
                  plan.color === 'orange' ? 'text-orange-900' :
                  'text-green-900'
                }`}>
                  {plan.name}
                </h3>
                <p className="text-sm text-gray-700">{plan.description}</p>
              </div>
              <ul className="space-y-1 text-sm text-gray-700">
                {plan.actions.map((action, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle className={`mt-0.5 flex-shrink-0 ${
                      plan.color === 'red' ? 'text-red-600' :
                      plan.color === 'orange' ? 'text-orange-600' :
                      'text-green-600'
                    }`} size={16} />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Resumen de Beneficios */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-100">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Beneficios de la Metodología ICER</h2>
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

