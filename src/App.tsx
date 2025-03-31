// External imports
import { BrowserRouter, Route, Routes } from 'react-router-dom';
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
  return (
    // prettier-ignore
    <BrowserRouter>
      <Routes>
        <Route path={APP_CONFIG.appPrefix} element={
          <AuthProvider>
            <PrivateRoute roles={['admin', 'super']}><Layout /></PrivateRoute>
          </AuthProvider>
        }>
          <Route index element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>}/>
          <Route path="dashboard" element={<Suspense fallback={<Loading />}><Dashboard /></Suspense>}/>
          <Route path="appointments" element={<Suspense fallback={<Loading />}><Appointments /></Suspense>}/>
          <Route path="reserve" element={<Suspense fallback={<Loading />}><ReserveAppointments /></Suspense>}/>
          <Route path="appointments/:id" element={<Suspense fallback={<Loading />}><ViewAppointment /></Suspense>}/>
          <Route path='professionals' element={(<Suspense fallback={<Loading />}><Professionals /></Suspense>)}/>
          <Route path='professionals/:id' element={(<Suspense fallback={<Loading />}><ViewProfessional /></Suspense>)}/>
          <Route path='professionals/create' element={(<Suspense fallback={<Loading />}><CreateProfessional /></Suspense>)}/>
          <Route path='professionals/update/:id' element={(<Suspense fallback={<Loading />}><UpdateProfessional /></Suspense>)}/>
          <Route path='settings' element={(<Suspense fallback={<Loading />}><Settings /></Suspense>)}/>
          <Route path='users' element={(<Suspense fallback={<Loading />}><Users /></Suspense>)}/>
          <Route path='users/:id' element={(<Suspense fallback={<Loading />}><ViewUser /></Suspense>) } />
          <Route path='users/create' element={(<Suspense fallback={<Loading />}><CreateUser /></Suspense>)}/>
          <Route path='users/update/:id' element={(<Suspense fallback={<Loading />}><UpdateUser /></Suspense>)}/>
          <Route path='email/:type/:id'  element={(<Suspense fallback={<Loading />}><SendEmail /></Suspense>)}/>
          <Route path='whatsapp/:id'  element={(<Suspense fallback={<Loading />}><WhatsApp /></Suspense>)}/>
        </Route>
        <Route path="/login" element={<Suspense fallback={<Loading />}><Login /></Suspense>}/>
        <Route path="/microsite/professional/:id" element={<Suspense fallback={<Loading />}><ProfessionalMicrosite /></Suspense>}/>
        <Route path="/" element={<Suspense fallback={<Loading />}><Login /></Suspense>}/>
        <Route path="*" element={<>Not found 404</>} />
      </Routes>
    </BrowserRouter>
  );
}
