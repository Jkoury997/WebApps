const express = require('express');
const connectDB = require('./database/db');
const mainRoute = require('./routes/mainRoute');
const morgan = require('morgan');
const cors = require('cors');
require('dotenv').config();

const { errorHandler } = require('./middlewares/errorMiddleware');

const { socketHandler,sendNotification} = require('./utils/socketHandler');

//Sockect Server

const socketIO = require("socket.io");
const http = require("http");




const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());
app.use(errorHandler);
// Configurar trust proxy si estás detrás de un proxy
app.set('trust proxy', true);


// Crear servidor HTTP
let server = http.createServer(app);

// Configurar Socket.IO con CORS permitido para cualquier origen
let io = socketIO(server, {
    cors: {
        origin: "*", // Permitir cualquier origen
        methods: ["GET", "POST"]
    }
});

// Usar el manejador de Socket.IO
socketHandler(io);

// Hacer io accesible en los controladores
app.set('socketio', io);

// Conectar a MongoDB y luego iniciar el servidor
connectDB().then(() => {
    app.use('/api', mainRoute);

    server.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}).catch((error) => {
    console.error('Failed to connect to MongoDB:', error);
    process.exit(1);
});


app.get('/send-notification', (req, res) => {
    const { userId, message } = req.query;
    const io = app.get('socketio');
    sendNotification(userId, { message }, io);
    res.send('Notification sent');
});