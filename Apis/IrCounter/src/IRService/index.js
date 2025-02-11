require('dotenv').config();
const { IRTCP } = require('./tcp');

function initTcp() {
  console.log('🌐 Iniciando servicio TCP de sensores...');
  
  new IRTCP({
    port: process.env.TCP_PORT || 8085,
    host: process.env.TCP_HOST || '127.0.0.1',
    record: process.env.RECORD_CYCLE === 'true'
  });

  console.log('✅ Servicio TCP iniciado correctamente.');
}

// Exportamos la función para llamarla manualmente desde `server.js`
module.exports = initTcp;
