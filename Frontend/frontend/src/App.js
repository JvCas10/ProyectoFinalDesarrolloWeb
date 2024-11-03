// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login/login';
import DashboardEstudiante from './components/estudiante/DashboardEstudiante';
import DetalleCursos from './components/estudiante/DetalleCursos';
import DashboardAdmin from './components/administrador/DashboardAdmin';
import ProgresoEstudiantes from './components/administrador/ProgresoEstudiantes';

// Componente de ruta protegida por roles
const ProtectedRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem('role');
  console.log("Rol actual en localStorage:", role);

  if (!role) {
    console.log("No hay rol en localStorage, redirigiendo al login.");
    return <Navigate to="/" />;
  }

  if (!allowedRoles.includes(role)) {
    console.log("Rol no autorizado, redirigiendo al login.");
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/student" element={<DashboardEstudiante />} />
        <Route path="/curso/:id" element={<DetalleCursos />} />
        {/* Ruta protegida para DashboardAdmin usando roles "admin" o "instructor" */}
        <Route 
          path="/DashboardAdmin" 
          element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <DashboardAdmin />
            </ProtectedRoute>
          } 
        />
        
        {/* Ruta protegida para ver el progreso de estudiantes, solo para admin */}
        <Route 
          path="/progreso-estudiantes" 
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ProgresoEstudiantes />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
