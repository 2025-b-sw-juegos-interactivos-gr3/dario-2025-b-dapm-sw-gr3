const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configurar middleware
app.use(express.static(path.join(__dirname, 'public')));

// RUTAS CORREGIDAS:
app.use('/models', express.static(path.join(__dirname, 'models')));
app.use('/sounds', express.static(path.join(__dirname, 'sounds')));

// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rutas de fallback para evitar errores 404
app.get('/models/:file', (req, res) => {
    res.status(404).send('Modelo no encontrado');
});

app.get('/sounds/:file', (req, res) => {
    res.status(404).send('Sonido no encontrado');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`
    🚛 ==========================================
    🚛  SIMULADOR DE MONTACARGAS - EXAMEN 01
    🚛  Servidor: http://localhost:${PORT}
    🚛 ==========================================
    `);
    console.log('✅ Si ves errores en la consola del navegador,');
    console.log('   no te preocupes - el juego tiene sistemas de fallback.');
});