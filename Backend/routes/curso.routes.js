const express = require('express');
const router = express.Router();
const { 
    getAllCursos, 
    addCurso, 
    getCursoPorID, 
    updateCurso, 
    deleteCurso, 
    agregarLeccion, 
    getLeccionPorID,
    inscribirUsuario 
} = require('../controllers/curso.controller');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware');

// Obtener todos los cursos (requiere autenticación)
router.get('/cursos', verifyToken, getAllCursos);

// Crear un curso (permitido para usuarios con rol "admin" o "instructor")
router.post('/curso', verifyToken, verifyRole(['admin', 'instructor']), addCurso);

// Obtener un curso específico por ID (requiere autenticación)
router.get('/curso/:id', verifyToken, getCursoPorID);

// Obtener una lección específica por ID dentro de un curso (requiere autenticación)
router.get('/curso/:cursoId/leccion/:leccionId', verifyToken, getLeccionPorID);

// Actualizar un curso por ID (permitido para usuarios con rol "admin" o "instructor")
router.put('/curso/:id', verifyToken, verifyRole(['admin', 'instructor']), updateCurso);

// Eliminar un curso por ID (permitido para usuarios con rol "admin" o "instructor")
router.delete('/curso/:id', verifyToken, verifyRole(['admin', 'instructor']), deleteCurso);

// Agregar lección a un curso (permitido para usuarios con rol "admin" o "instructor")
router.put('/curso/:id/leccion', verifyToken, verifyRole(['admin', 'instructor']), agregarLeccion);

// Inscribir usuario a un curso (requiere autenticación)
router.post('/curso/:cursoId/inscribirse', verifyToken, inscribirUsuario);

module.exports = router;
