require('dotenv').config();
const { IRTCP } = require('./tcp');

function initTcp() {
  console.info('🌐 Iniciando el servicio TCP de sensores...');

  try {
    const tcpService = new IRTCP({
      port: process.env.TCP_PORT || 8085,
      host: process.env.TCP_HOST || '127.0.0.1',
      record: process.env.RECORD_CYCLE === 'true'
    });

    console.info('✅ Servicio TCP iniciado correctamente.');
  } catch (error) {
    console.error('❌ Error al iniciar el servicio TCP:', error);
  }
}

module.exports = initTcp;
