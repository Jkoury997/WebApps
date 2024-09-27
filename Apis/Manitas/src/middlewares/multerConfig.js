const multer = require('multer');
const path = require('path');

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta donde se guardarán las imágenes
  },
  filename: (req, file, cb) => {
    // Obtener empresa de req.body o de req.user, dependiendo de tu lógica
    const empresa = req.body.empresa || req.user.empresa;

    // Incluir el nombre de la empresa en el archivo
    cb(null, `${empresa}-${Date.now()}-${file.originalname}`);
  },
});

// Filtros de archivos: solo imágenes
const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png/;
  const mimetype = filetypes.test(file.mimetype);
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

  if (mimetype && extname) {
    return cb(null, true);
  }
  cb('Error: Solo se permiten imágenes!');
};

// Configuración de multer
const upload = multer({
  storage: storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10 MB de límite de tamaño
  fileFilter: fileFilter,
});

module.exports = upload;
