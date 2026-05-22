const express = require('express');
const { createClient } = require('@supabase/supabase-client');
require('dotenv').config();

const app = express();
app.use(express.json());

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Ruta base de prueba para verificar que el sistema está vivo
app.get('/', (req, res) => {
  res.send('Servidor del Café GICE Tech corriendo exitosamente.');
});

// Ruta corregida para insertar los lotes de café
app.post('/api/cafe', async (req, res) => {
  try {
    const { lote, variedad, kilos, estado } = req.body;
    
    const { data, error } = await supabase
      .from('lotes_cafe')
      .insert([{ lote, variedad, kilos, estado }]);

    if (error) throw error;

    res.status(201).json({ mensaje: 'Lote registrado con éxito', data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
