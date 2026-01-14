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
      <div className="card-static relative overflow-hidden p-6 md:p-8 bg-gradient-to-r from-brand-primary to-brand-primary-strong text-white">
        <div className="absolute inset-0 opacity-25 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.35),transparent_35%),radial-gradient(circle_at_80%_0%,rgba(238,114,28,0.35),transparent_40%)]" />
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Dashboard de Reportes</h1>
            <p className="mt-1 text-sm text-white/80">
              Visión general del estado de los colaboradores y riesgos.
            </p>
          </div>
          <div className="pill bg-white/15 text-white border border-white/25 backdrop-blur-sm">Actualizado en vivo</div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Colaboradores</p>
              <p className="text-3xl font-bold text-slate-900 mt-1">{stats.totalCollaborators}</p>
            </div>
            <div className="p-3 bg-brand-primary/10 rounded-xl border border-brand-primary/20">
              <Users className="text-brand-primary" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Riesgo Alto</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.riskDistribution.high}</p>
            </div>
            <div className="p-3 bg-red-50 rounded-xl border border-red-200">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Riesgo Medio</p>
              <p className="text-3xl font-bold text-amber-600 mt-1">{stats.riskDistribution.medium}</p>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
              <AlertTriangle className="text-amber-600" size={24} />
            </div>
          </div>
        </div>

        <div className="card p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-slate-500">Riesgo Bajo / Sin Riesgo</p>
              <p className="text-3xl font-bold text-emerald-600 mt-1">
                {stats.riskDistribution.low + stats.riskDistribution.none}
              </p>
            </div>
            <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200">
              <CheckCircle className="text-emerald-600" size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* High Risk Table */}
      <div className="table-shell">
        <div className="px-6 py-5 border-b border-[var(--color-border-subtle)] bg-brand-surface-strong/60">
          <h3 className="text-lg font-semibold text-slate-900">Colaboradores en Riesgo Alto</h3>
        </div>
        {stats.highRiskCollaborators.length === 0 ? (
          <div className="p-8 text-center text-slate-500">
            No hay colaboradores en riesgo alto.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-[var(--color-border-subtle)]">
              <thead>
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Nombre</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Proyecto</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Fecha Ingreso</th>
                  <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ver</span></th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-[var(--color-border-subtle)]">
                {stats.highRiskCollaborators.map((collab) => (
                  <tr key={collab.id} className="transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-semibold text-slate-900">{collab.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-600">{collab.project}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {new Date(collab.admissionDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button 
                        onClick={() => navigate(`/colaboradores/${collab.id}`)}
                        className="text-brand-primary hover:text-brand-primary-strong font-semibold"
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

