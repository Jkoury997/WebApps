const fs = require("fs");
const path = require("path");

// 📌 **Definir la ruta de la carpeta `uploads`**
const uploadDir = path.join(__dirname, "../../uploads");

// 📌 **Función para crear la carpeta si no existe**
const createUploadsFolder = () => {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir, { recursive: true });
        console.log("📂 Carpeta 'uploads' creada automáticamente.");
    } else {
        console.log("✅ Carpeta 'uploads' ya existe.");
    }
};

// 📌 **Ejecutar la función cuando se importe este archivo**
createUploadsFolder();

module.exports = createUploadsFolder;
