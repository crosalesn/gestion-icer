import { Target } from 'lucide-react';

const ActionPlansList = () => {
  return (
    <div className="space-y-6">
       <div>
          <h1 className="text-2xl font-bold text-gray-900">Planes de Acción Activos</h1>
          <p className="mt-1 text-sm text-gray-500">
            Seguimiento de planes de mejora asignados.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-12 text-center">
            <div className="mx-auto h-12 w-12 text-gray-400">
            <Target size={48} />
            </div>
            <h3 className="mt-2 text-sm font-medium text-gray-900">Sección en construcción</h3>
            <p className="mt-1 text-sm text-gray-500">
                Para ver los planes de acción, por favor acceda a través de la ficha del colaborador.
            </p>
      </div>
    </div>
  );
};

export default ActionPlansList;

