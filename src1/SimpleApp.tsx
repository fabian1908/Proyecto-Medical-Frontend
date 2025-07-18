import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProfilePage from './pages/ProfilePage';
import MedicalServicesPage from './pages/MedicalServicesPage';
import MainLayout from './layouts/MainLayout';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import { TipoUsuarioEnum } from './interfaces/usuario';
import LoadingSpinner from './components/LoadingSpinner';
import DoctorDetailPage from './pages/DoctorDetailPage';
import UserDashboardPage from './pages/UserDashboardPage';
import DoctorDashboardPage from './pages/DoctorDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import UsersManagementPage from './pages/admin/UsersManagementPage';
import PersonasManagementPage from './pages/admin/PersonasManagementPage';
import EspecialidadesManagementPage from './pages/admin/EspecialidadesManagementPage';
import ServiciosManagementPage from './pages/admin/ServiciosManagementPage';
import ConsultoriosManagementPage from './pages/admin/ConsultoriosManagementPage';
import CitasManagementPage from './pages/admin/CitasManagementPage';
import HorariosManagementPage from './pages/admin/HorariosManagementPage';
import ReseniasManagementPage from './pages/admin/ReseniasManagementPage';
import PagosManagementPage from './pages/admin/PagosManagementPage';
import RecetasManagementPage from './pages/admin/RecetasManagementPage';
import DiagnosticosManagementPage from './pages/admin/DiagnosticosManagementPage';


const SimpleApp: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            {/* Rutas Públicas */}
            <Route path="/" element={<HomePage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/servicios-medicos" element={<MedicalServicesPage />} />
            <Route path="/doctors" element={<MedicalServicesPage />} /> {/* Redirige la ruta anterior */}
            <Route path="/doctors/:id" element={<DoctorDetailPage />} />
            
            {/* Rutas protegidas para cualquier usuario autenticado */}
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute allowedRoles={[TipoUsuarioEnum.PACIENTE, TipoUsuarioEnum.DOCTOR, TipoUsuarioEnum.ADMIN]}>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            
            {/* Dashboard para PACIENTE */}
            <Route 
              path="/user/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[TipoUsuarioEnum.PACIENTE]}>
                  <UserDashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Dashboard para DOCTOR */}
            <Route 
              path="/doctor/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[TipoUsuarioEnum.DOCTOR]}>
                  <DoctorDashboardPage />
                </ProtectedRoute>
              } 
            />
            
            {/* Dashboard para ADMIN con rutas anidadas */}
            <Route 
              path="/admin/dashboard" 
              element={
                <ProtectedRoute allowedRoles={[TipoUsuarioEnum.ADMIN, TipoUsuarioEnum.COORDINADOR]}>
                  <AdminDashboardPage />
                </ProtectedRoute>
              } 
            >
              {/* Página de bienvenida del admin */}
              <Route index element={<div className="text-xl text-gray-700">Bienvenido al Panel de Administrador. Selecciona una opción del menú.</div>} />
              
              {/* Gestión de entidades */}
              <Route path="users" element={<UsersManagementPage />} />
              <Route path="personas" element={<PersonasManagementPage />} />
              <Route path="especialidades" element={<EspecialidadesManagementPage />} />
              <Route path="servicios" element={<ServiciosManagementPage />} />
              <Route path="consultorios" element={<ConsultoriosManagementPage />} />
              <Route path="citas" element={<CitasManagementPage />} />
              <Route path="horarios" element={<HorariosManagementPage />} />
              <Route path="recetas" element={<RecetasManagementPage />} />
              <Route path="diagnosticos" element={<DiagnosticosManagementPage />} />
              <Route path="resenias" element={<ReseniasManagementPage />} />
              <Route path="pagos" element={<PagosManagementPage />} />
            </Route>
            
            <Route path="*" element={<div>Página no encontrada</div>} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default SimpleApp;
