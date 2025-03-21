const http = require("http");
const { Server } = require("socket.io");
const app = require("./app");

const PORT = process.env.PORT || 5000;

// Servidor HTTP
const server = http.createServer(app);

// WebSockets
const io = new Server(server, {
    cors: { origin: "*" }
});

io.on("connection", (socket) => {
    console.log("🔵 Usuario conectado:", socket.id);

    socket.on("estadoTarea", (data) => {
        io.emit("actualizacionTarea", data);
    });

    socket.on("disconnect", () => {
        console.log("🔴 Usuario desconectado:", socket.id);
    });
});

// Iniciar servidor
server.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
