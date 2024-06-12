// App
import Layout from './layout/Layout';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
// Lazy loaded components
const Appointments = lazy(() => import('./appointments/Appointments'));
const Dashboard = lazy(() => import('./dashboard/Dashboard'));
const Professionals = lazy(() => import('./professionals/Professionals'));
const CreateProfessional = lazy(() => import('./professionals/components/CreateProfessional'));
const UpdateProfessional = lazy(() => import('./professionals/components/UpdateProfessional'));
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
          path: '*',
          element: <>Not found 404</>,
        },
      ],
    },
  ]);
  return <RouterProvider router={router} />;
}
