const fs = require('fs');
const path = require('path');

const logDir = path.join(__dirname, 'logs');
const logFilePath = path.join(logDir, 'log-cierres.txt');

if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
}

function logToFile(mensaje) {
    const ahora = new Date().toLocaleString();
    const linea = `[${ahora}] ${mensaje}\n`;
    fs.appendFile(logFilePath, linea, (err) => {
        if (err) console.error("Error al escribir en el log:", err.message);
    });
}

module.exports = { logToFile };
