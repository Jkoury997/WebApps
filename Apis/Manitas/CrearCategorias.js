// createCategoriasMantenimiento.js
const mongoose = require('mongoose');
const Categoria = require('./src/database/models/Categoria'); // Asegúrate de ajustar el path al modelo de Categoría

// Conexión a la base de datos
const conectarDB = async () => {
  try {
    await mongoose.connect('mongodb://apiManitas:Jorge97@vps-3687594-x.dattaweb.com:27017/ManitasMakeyou', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
    process.exit(1); // Finaliza el script si no se puede conectar
  }
};

const empresa = "a17cd3ca-3f71-48ec-bfc1-76ef94a57921"

// Crear las categorías de mantenimiento
const crearCategoriasMantenimiento = async () => {
  const categorias = [
    {
      titulo: 'Reparaciones Eléctricas',
      descripcion: 'Tareas relacionadas con la reparación y mantenimiento del sistema eléctrico.',
      creadoPor: 'Jorge Koury',
      empresa: empresa
    },
    {
      titulo: 'Plomería',
      descripcion: 'Mantenimiento y reparación de instalaciones de agua y tuberías.',
      creadoPor: 'Jorge Koury',
      empresa: empresa
    },
    {
      titulo: 'Pintura y Restauración',
      descripcion: 'Tareas de pintura, restauración de superficies y paredes.',
      creadoPor: 'Jorge Koury',
      empresa: empresa
    },
    {
      titulo: 'Mantenimiento de Aire Acondicionado',
      descripcion: 'Instalación y reparación de equipos de aire acondicionado.',
      creadoPor: 'Jorge Koury',
      empresa: empresa
    },
    {
      titulo: 'Carpintería',
      descripcion: 'Tareas relacionadas con la reparación y construcción de elementos de madera.',
      creadoPor: 'Jorge Koury',
      empresa: empresa
    },
    {
      titulo: 'Jardinería',
      descripcion: 'Mantenimiento de áreas verdes, poda de plantas y árboles.',
      creadoPor: 'Jorge Koury',
      empresa: empresa
    },
    {
      titulo: 'Limpieza General',
      descripcion: 'Limpieza de áreas comunes, oficinas y espacios públicos.',
      creadoPor: 'Jorge Koury',
      empresa: empresa
    },
    {
      titulo: 'Mantenimiento de Equipos',
      descripcion: 'Revisión y reparación de equipos y maquinarias.',
      creadoPor: 'Jorge Koury',
      empresa: empresa
    },
    {
      titulo: 'Seguridad y Alarmas',
      descripcion: 'Revisión y reparación de sistemas de seguridad, alarmas y cámaras.',
      creadoPor: 'Jorge Koury',
      empresa: empresa
    },
    {
      titulo: 'Control de Plagas',
      descripcion: 'Tareas relacionadas con la eliminación de plagas y fumigación.',
      creadoPor: 'Jorge Koury',
      empresa: empresa
    },
  ];

  try {
    await Categoria.insertMany(categorias); // Inserta las categorías en la base de datos
    console.log('Categorías de mantenimiento creadas con éxito');
  } catch (error) {
    console.error('Error al crear categorías', error);
  } finally {
    mongoose.connection.close(); // Cierra la conexión con la base de datos
  }
};

// Ejecuta el script
const ejecutarScript = async () => {
  await conectarDB();
  await crearCategoriasMantenimiento();
};

ejecutarScript();
