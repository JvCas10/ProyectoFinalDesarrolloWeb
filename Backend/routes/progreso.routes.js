const express = require('express');
const router = express.Router();
const { 
    registrarAcceso, 
    obtenerProgreso, 
    obtenerProgresoEstudiantes, 
    obtenerProgresoGeneralUsuario 
} = require('../controllers/progreso.controller');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware'); // Importa verifyToken y verifyRole

// Registrar acceso a una lección (solo accesible para usuarios con rol "admin")
router.post('/curso/:cursoId/acceso', verifyToken, registrarAcceso);

// Obtener el progreso de un estudiante en un curso (solo accesible para usuarios con rol "admin")
router.get('/curso/:cursoId/progreso/:estudianteId', verifyToken, obtenerProgreso);

// Obtener el progreso de todos los estudiantes con rol 'user' (solo accesible para usuarios con rol "admin")
router.get('/progreso-estudiantes', verifyToken, verifyRole(['admin']), obtenerProgresoEstudiantes);

// Obtener el progreso de un usuario en todos los cursos (solo accesible para usuarios con rol "admin")
router.get('/progreso/:usuarioId', verifyToken, verifyRole(['admin']), obtenerProgresoGeneralUsuario);

module.exports = router;
