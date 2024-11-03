const jwt = require('jsonwebtoken');
const SECRET_KEY = 'mysecretkey';

// Middleware para verificar el token de autorización
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ mensaje: 'Token no proporcionado' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        req.user = decoded;  // Almacenar los datos decodificados del usuario en `req.user`
        next();
    } catch (error) {
        return res.status(401).json({ mensaje: 'Token no válido' });
    }
};

// Middleware para verificar el rol del usuario
const verifyRole = (requiredRoles) => (req, res, next) => {
    if (!req.user || !requiredRoles.includes(req.user.role)) {
        return res.status(403).json({ mensaje: 'Acceso denegado: rol no autorizado' });
    }
    next();
};

module.exports = { verifyToken, verifyRole };
