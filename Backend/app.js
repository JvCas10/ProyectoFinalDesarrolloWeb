const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors'); // Importar el paquete cors
const app = express();
const port = 3001;
const usuarioRoutes = require('./routes/usuario.routes');

// Middleware para habilitar CORS
app.use(cors({
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
}));

app.use(express.json());
app.use('/api', usuarioRoutes);

app.get('/', (req, res) => {
    res.send('Hello world!');
});

app.listen(port, () => {
    console.log('El servidor está listo');
});

mongoose.connect('mongodb://localhost:27017/miBaseDeDatos').then(() => {
    console.log('Conexión a MongoDB exitosa');
}).catch((error) => {
    console.error('Error al conectar a MongoDB:', error);
});
