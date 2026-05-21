// Carga de librerías esenciales para el control de datos
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
// Configuración del puerto de escucha para producción en la nube o entorno local
const PORT = process.env.PORT || 3000;

// Habilitar el intercambio de recursos de origen cruzado (CORS) y lectura de JSON
app.use(cors());
app.use(express.json());

// Configuración de la conexión segura a la base de datos PostgreSQL (Supabase)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false // Requerido para conexiones seguras en la nube
    }
});

// RUTA LOCAL/PRODUCCIÓN: Verificar que el servidor responde con éxito
app.get('/', (req, res) => {
    res.send('Servidor de Trazabilidad de Café SCAF - Operativo y En Línea');
});

// API ENDPOINT: Recibir y almacenar los datos de control del café
app.post('/api/lotes', async (req, res) => {
    const { lote, brix, fermentacion, ph, temp, secado, humedad, estado } = req.body;

    try {
        const queryText = `
            INSERT INTO trazabilidad_cafe (codigo_lote, grados_brix, tipo_fermentacion, ph_final, temperatura_max, tipo_secado, humedad_final, dictamen_agronomico)
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;
        `;
        const values = [lote, brix, fermentacion, ph, temp, secado, humedad, estado];
        const result = await pool.query(queryText, values);
        
        // Respuesta corporativa exitosa
        res.status(201).json({ success: true, mensaje: 'Evaluación técnica registrada en la base de datos', datos: result.rows[0] });
    } catch (err) {
        console.error('Error de inserción analítica:', err.message);
        res.status(500).json({ success: false, error: 'Fallo estructural al guardar en la nube' });
    }
});

// API ENDPOINT: Obtener todos los registros de lotes para el Dashboard
app.get('/api/lotes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM trazabilidad_cafe ORDER BY fecha_registro DESC;');
        res.json(result.rows);
    } catch (err) {
        console.error('Error de lectura analítica:', err.message);
        res.status(500).json({ success: false, error: 'Fallo al consultar el historial de lotes' });
    }
});

// Iniciar el servicio en el puerto asignado
app.listen(PORT, () => {
    console.log(`Servidor de ingeniería de café corriendo en el puerto ${PORT}`);
});