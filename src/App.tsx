// External imports
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
// Imports
import AuthProvider from '@core/auth/AuthProvider';
import Layout from '@layout/Layout';
import { APP_CONFIG } from '@config/app.config';
import { Loading } from '@core/components/common/Loading';
import { PrivateRoute } from '@core/auth/PrivateRoute';
// Lazy loaded components
const Login = lazy(() => import('./pages/auth/Login'));

const Appointments = lazy(() => import('./pages/appointments/Appointments'));
const ReserveAppointments = lazy(() => import('./pages/appointments/components/ReserveAppointments'));
const ViewAppointment = lazy(() => import('./pages/appointments/components/ViewAppointment'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));

const ProfessionalMicrosite = lazy(() => import('./pages/microsites/ProfessionalMicrosite'));

const Professionals = lazy(() => import('./pages/professionals/Professionals'));
const CreateProfessional = lazy(() => import('./pages/professionals/components/CreateProfessional'));
const UpdateProfessional = lazy(() => import('./pages/professionals/components/UpdateProfessional'));
const ViewProfessional = lazy(() => import('./pages/professionals/components/ViewProfessional'));

const Settings = lazy(() => import('./pages/settings/Settings'));

const Users = lazy(() => import('./pages/users/Users'));
const CreateUser = lazy(() => import('./pages/users/components/CreateUser'));
const UpdateUser = lazy(() => import('./pages/users/components/UpdateUser'));
const ViewUser = lazy(() => import('./pages/users/components/ViewUser'));

const SendEmail = lazy(() => import('./pages/email/SendEmail'));
const WhatsApp = lazy(() => import('./pages/whatsapp/WhatsApp'));
// React component
export default function App() {
  // prettier-ignore
  const router = createBrowserRouter([
    { index: true, element: (<Suspense fallback={<Loading />}><Login /></Suspense>) },
    { path: '/login', element: (<Suspense fallback={<Loading />}><Login /></Suspense>) },
    { path: APP_CONFIG.appPrefix, element: <PrivateRoute roles={['admin', 'super']}><Layout /></PrivateRoute>, children:
      [
        { index: true, element: (<Suspense fallback={<Loading />}><Dashboard /></Suspense>) },
        { path: 'dashboard', element: (<Suspense fallback={<Loading />}><Dashboard /></Suspense>) },
        { path: 'appointments', element: (<Suspense fallback={<Loading />}><Appointments /></Suspense>) },
        { path: 'reserve', element: (<Suspense fallback={<Loading />}><ReserveAppointments /></Suspense>) },
        { path: 'appointments/:id', element: (<Suspense fallback={<Loading />}><ViewAppointment /></Suspense>) },
        { path: 'professionals', element: (<Suspense fallback={<Loading />}><Professionals /></Suspense>) },
        { path: 'professionals/:id', element: (<Suspense fallback={<Loading />}><ViewProfessional /></Suspense>) },
        { path: 'professionals/create', element: (<Suspense fallback={<Loading />}><CreateProfessional /></Suspense>) },
        { path: 'professionals/update/:id', element: (<Suspense fallback={<Loading />}><UpdateProfessional /></Suspense>) },
        { path: 'settings', element: (<Suspense fallback={<Loading />}><Settings /></Suspense>) },
        { path: 'users', element: (<Suspense fallback={<Loading />}><Users /></Suspense>) },
        { path: 'users/:id', element: (<Suspense fallback={<Loading />}><ViewUser /></Suspense>) },
        { path: 'users/create', element: (<Suspense fallback={<Loading />}><CreateUser /></Suspense>) },
        { path: 'users/update/:id', element: (<Suspense fallback={<Loading />}><UpdateUser /></Suspense>) },
        { path: 'email/:type/:id',  element: (<Suspense fallback={<Loading />}><SendEmail /></Suspense>) },
        { path: 'whatsapp/:id',  element: (<Suspense fallback={<Loading />}><WhatsApp /></Suspense>) },
        { path: '*', element: <>Not found 404</> },
      ],
    },
    { path: '/microsite/professional/:id', element: (<Suspense fallback={<Loading />}><ProfessionalMicrosite /></Suspense>) },
  ]);

  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}
