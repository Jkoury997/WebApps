const http = require('http');
const cron = require('node-cron');
require('dotenv').config();

let tokens = {}; // Almacena los tokens individuales por empresa

// Función para obtener el token de acceso principal (AccessKey) y las empresas asociadas
async function fetchAccessKey() {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '190.216.66.210',
            port: 10287,
            path: '/api/Login',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const req = http.request(options, res => {
            let data = '';

            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    const accessKey = response.AccessKey;
                    const empresas = response.Empresas.map(empresa => ({
                        Codigo: empresa.Codigo,
                        Nombre: empresa.Nombre
                    }));

                    tokens['app'] = {
                        accessKey: accessKey,
                        empresas: empresas
                    };

                    resolve(accessKey);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', error => {
            console.error('Error obteniendo el AccessKey:', error.message);
            reject(error);
        });

        const postData = JSON.stringify({
            Usuario: process.env.EMAIL_FICHADA,
            Password: process.env.PASSWORD_FICHADA
        });

        req.write(postData);
        req.end();
    });
}

// Función para obtener un token por empresa usando el AccessKey y el Código de empresa
async function fetchTokenForCompany(accessKey, empresaCodigo) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: '190.216.66.210',
            port: 10287,
            path: '/api/UserAccess',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };

        const req = http.request(options, res => {
            let data = '';

            res.on('data', chunk => { data += chunk; });
            res.on('end', () => {
                try {
                    const response = JSON.parse(data);
                    const token = response.Token;
                    resolve(token);
                } catch (error) {
                    reject(error);
                }
            });
        });

        req.on('error', error => {
            console.error(`Error obteniendo el token para la empresa ${empresaCodigo}:`, error.message);
            reject(error);
        });

        const postData = JSON.stringify({
            AccessKey: accessKey,
            Empresa: empresaCodigo
        });

        req.write(postData);
        req.end();
    });
}

// Función principal para obtener el AccessKey y luego los tokens de cada empresa
async function fetchTokensForAllCompanies() {
    try {
        // Obtén el AccessKey y las empresas asociadas
        const accessKey = await fetchAccessKey();
        const empresas = tokens['app'].empresas;

        // Recorre cada empresa y solicita su token usando el AccessKey
        for (const empresa of empresas) {
            const token = await fetchTokenForCompany(accessKey, empresa.Codigo);
            tokens[empresa.Nombre] = {
                token: token,
                empresaCodigo: empresa.Codigo
            };
        }

    } catch (error) {
        console.error('Error al actualizar tokens de empresas:', error.message);
    }
}

// Configura el cron job para renovar los tokens cada 8 horas
function startTokenRenewal() {
    fetchTokensForAllCompanies(); // Ejecuta la obtención inicial
    cron.schedule('0 */8 * * *', fetchTokensForAllCompanies); // Renueva cada 8 horas
}

module.exports = { tokens, startTokenRenewal };
