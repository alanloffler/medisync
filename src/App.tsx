// App
import Layout from './layout/Layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
// Lazy loaded components
const Appointments = lazy(() => import('./pages/appointments/Appointments'));
const ViewAppointment = lazy(() => import('./pages/appointments/components/ViewAppointment'));
const Dashboard = lazy(() => import('./pages/dashboard/Dashboard'));
const Professionals = lazy(() => import('./pages/professionals/Professionals'));
const CreateProfessional = lazy(() => import('./pages/professionals/components/CreateProfessional'));
const UpdateProfessional = lazy(() => import('./pages/professionals/components/UpdateProfessional'));
const WhatsApp = lazy(() => import('./pages/whatsapp/WhatsApp'));
// React component
export default function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Layout />,
      children: [
        {
          path: '/dashboard',
          element: (
            <Suspense fallback={<>Loading...</>}>
              <Dashboard />
            </Suspense>
          ),
        },
        {
          path: '/',
          element: (
            <Suspense fallback={<>Loading...</>}>
              <Appointments />
            </Suspense>
          ),
          //   async lazy() {
          //     const { Appointments } = await import('./appointments/Appointments');
          //     return { Component: Appointments };
          //   }
        },
        {
          path: '/appointments/:id',
          element: (
            <Suspense fallback={<>Loading...</>}>
              <ViewAppointment />
            </Suspense>
          ),
        },
        {
          path: '/professionals',
          element: (
            <Suspense fallback={<>Loading...</>}>
              <Professionals />
            </Suspense>
          ),
        },
        {
          path: '/professionals/create',
          element: (
            <Suspense fallback={<>Loading...</>}>
              <CreateProfessional />
            </Suspense>
          ),
        },
        {
          path: '/professionals/update/:id',
          element: (
            <Suspense fallback={<>Loading...</>}>
              <UpdateProfessional />
            </Suspense>
          ),
        },
        {
          path: '/whatsapp/:id',
          element: (
            <Suspense fallback={<>Loading...</>}>
              <WhatsApp />
            </Suspense>
          ),
        },
        {
          path: '*',
          element: <>Not found 404</>,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
