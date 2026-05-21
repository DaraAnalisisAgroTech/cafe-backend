require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const primerLote = {
    codigo_lote: 'LOTE-CAFE-MERIDA-001',
    grados_brix: 24.50,
    tipo_fermentacion: 'Anaeróbica Extendida (72h)',
    ph_final: 4.20,
    temperatura_max: 36.8,
    tipo_secado: 'Camas Africanas Bajo Sombra',
    humedad_final: 11.5,
    dictamen_agronomico: 'APROBADO'
};

async function registrarPrimerLote() {
    console.log('⏳ Iniciando transferencia de datos hacia Supabase desde la nube...');
    
    const { data, error } = await supabase
        .from('trazabilidad_cafe')
        .insert([primerLote])
        .select();

    if (error) {
        console.error('🔴 Error crítico en la inserción:', error.message);
    } else {
        console.log('🟢 ¡ÉXITO TOTAL! Primer lote registrado en Supabase exitosamente.');
        console.log('Datos confirmados:', data);
    }
}

registrarPrimerLote();