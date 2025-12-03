import { Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/login/login';
import Home from '../pages/home/home';
import CollaboratorsList from '../pages/collaborators/collaborators-list';
import CollaboratorDetail from '../pages/collaborators/collaborator-detail';
import UsersList from '../pages/users/users-list';
import CreateUser from '../pages/users/create-user';
import MyEvaluations from '../pages/evaluations/my-evaluations';
import EvaluationForm from '../pages/evaluations/evaluation-form';
import TemplatesList from '../pages/evaluations/templates-list';
import TemplateEditor from '../pages/evaluations/template-editor';
import ActionPlansList from '../pages/action-plans/action-plans-list';
import AssignPlan from '../pages/action-plans/assign-plan';
import Dashboard from '../pages/reports/dashboard';
import PrivateRoute from './private-route';
import MainLayout from '../shared/components/layout/main-layout';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />

      {/* Private Routes */}
      <Route element={<PrivateRoute />}>
        <Route element={<MainLayout />}>
            <Route path="/" element={<Home />} />
            <Route path="/colaboradores" element={<CollaboratorsList />} />
            <Route path="/colaboradores/:id" element={<CollaboratorDetail />} />
            <Route path="/usuarios" element={<UsersList />} />
            <Route path="/usuarios/nuevo" element={<CreateUser />} />
            <Route path="/evaluaciones" element={<MyEvaluations />} />
            <Route path="/evaluaciones/plantillas" element={<TemplatesList />} />
            <Route path="/evaluaciones/plantillas/:id" element={<TemplateEditor />} />
            <Route path="/evaluaciones/:id" element={<EvaluationForm />} />
            <Route path="/planes" element={<ActionPlansList />} />
            <Route path="/planes/asignar/:collaboratorId" element={<AssignPlan />} />
            <Route path="/reportes" element={<Dashboard />} />
            {/* Add other routes here */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Route>
    </Routes>
  );
};
