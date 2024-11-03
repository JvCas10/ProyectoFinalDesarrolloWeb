const express = require('express');
const router = express.Router();
const { 
    getAllUsuarios, 
    addUsuario, 
    getUsuarioPorID, 
    updateUser, 
    deleteUser, 
    authenticateUser, 
    putUserRole,
    getInstructores 
} = require('../controllers/usuario.controller');
const { verifyToken, verifyRole } = require('../middleware/authMiddleware'); // Importa verifyToken y verifyRole

// Definir las rutas y aplicar verifyToken a cada una (excepto a la de autenticación)
router.get('/usuarios', verifyToken, verifyRole(['admin', 'instructor']), getAllUsuarios);             // Obtener todos los usuarios
router.post('/usuario', verifyToken, verifyRole(['admin', 'instructor']), addUsuario);                 // Crear un nuevo usuario
router.get('/usuario/:id', verifyToken, verifyRole(['admin', 'instructor']), getUsuarioPorID);         // Obtener un usuario específico
router.put('/usuario/:id', verifyToken, verifyRole(['admin', 'instructor']), updateUser);              // Actualizar un usuario
router.delete('/usuario/:id', verifyToken, verifyRole(['admin', 'instructor']), deleteUser);           // Eliminar un usuario
router.post('/user-login', authenticateUser);                                            // Ruta de autenticación (sin verificación de token)
router.put('/usuario/:id/role', verifyToken, verifyRole(['admin', 'instructor']), putUserRole);        // Cambiar el rol de un usuario

// Nueva ruta para obtener solo los usuarios con rol de instructor
router.get('/instructores', verifyToken, verifyRole(['admin', 'instructor']), getInstructores);

module.exports = router;
