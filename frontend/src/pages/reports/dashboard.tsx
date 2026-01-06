import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import reportsService from '../../features/reports/services/reports-service';
import type { DashboardStats } from '../../features/reports/types/report.types';
import { Users, AlertTriangle, CheckCircle } from 'lucide-react';

const Dashboard = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await reportsService.getDashboardStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-center">Cargando reporte...</div>;
  }

  if (!stats) {
    return <div className="p-8 text-center text-red-500">Error al cargar el dashboard.</div>;
  }

  return (
    <div className="space-y-8">
       <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard de Reportes</h1>
          <p className="mt-1 text-sm text-gray-500">
            Visión general del estado de los colaboradores y riesgos.
          </p>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Colaboradores</p>
                        <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalCollaborators}</p>
                    </div>
                    <div className="p-3 bg-blue-50 rounded-full">
                        <Users className="text-blue-600" size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Riesgo Alto</p>
                        <p className="text-3xl font-bold text-red-600 mt-1">{stats.riskDistribution.high}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-full">
                        <AlertTriangle className="text-red-600" size={24} />
                    </div>
                </div>
            </div>

             <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Riesgo Medio</p>
                        <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.riskDistribution.medium}</p>
                    </div>
                    <div className="p-3 bg-yellow-50 rounded-full">
                        <AlertTriangle className="text-yellow-600" size={24} />
                    </div>
                </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow border border-gray-100">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-gray-500">Riesgo Bajo / Sin Riesgo</p>
                        <p className="text-3xl font-bold text-green-600 mt-1">
                            {stats.riskDistribution.low + stats.riskDistribution.none}
                        </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-full">
                        <CheckCircle className="text-green-600" size={24} />
                    </div>
                </div>
            </div>
        </div>

        {/* High Risk Table */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-6 py-5 border-b border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Colaboradores en Riesgo Alto</h3>
            </div>
            {stats.highRiskCollaborators.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                    No hay colaboradores en riesgo alto.
                </div>
            ) : (
                 <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Proyecto</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha Ingreso</th>
                            <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ver</span></th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {stats.highRiskCollaborators.map((collab) => (
                            <tr key={collab.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm font-medium text-gray-900">{collab.name}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="text-sm text-gray-500">{collab.project}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(collab.admissionDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button 
                                        onClick={() => navigate(`/colaboradores/${collab.id}`)}
                                        className="text-blue-600 hover:text-blue-900"
                                    >
                                        Ver Ficha
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            )}
        </div>
    </div>
  );
};

export default Dashboard;

