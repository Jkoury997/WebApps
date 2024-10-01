// createEmpresas.js
const mongoose = require('mongoose');
const Empresa = require('./src/database/models/Empresa'); // Asegúrate de ajustar el path al modelo de Empresa

// Conexión a la base de datos
const conectarDB = async () => {
  try {
    await mongoose.connect('Colocar Uri', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Conectado a la base de datos');
  } catch (error) {
    console.error('Error al conectar a la base de datos', error);
    process.exit(1); // Finaliza el script si no se puede conectar
  }
};

// Crear las empresas
const crearEmpresas = async () => {
  const empresas = [
    {
      idSistema: 1,
      EmpresaSistema: 'Marcela Koury',
      nombre: 'Marcela Koury',
      direccion: 'Avenida Juan Manuel de Rosas 1061, Lomas del Mirador',
      telefono: '123456789',
      email: 'empresa1@ejemplo.com',
    },
    {
      idSistema: 2,
      EmpresaSistema: 'Make You',
      nombre: 'Make You',
      direccion: 'Charlone 1664, La Tablada',
      telefono: '987654321',
      email: 'empresa2@ejemplo.com',
    },
    {
      idSistema: 3,
      EmpresaSistema: 'Emprendimiento Directorio',
      nombre: 'Emprendimiento Directorio',
      direccion: 'Calle Ejemplo 456',
      telefono: '456123789',
      email: 'empresa3@ejemplo.com',
    },
    {
        idSistema: 4,
        EmpresaSistema: 'Marshadi Medias',
        nombre: 'Marshadi Medias',
        direccion: 'Calle Ejemplo 4563',
        telefono: '456123789',
        email: 'empresa4@ejemplo.com',
      },
      {
        idSistema: 5,
        EmpresaSistema: 'Zalei',
        nombre: 'Zalei',
        direccion: 'Calle Ejemplo 4562',
        telefono: '456123789',
        email: 'empresa5@ejemplo.com',
      },
    // Agrega más empresas según lo necesites
  ];

  try {
    await Empresa.insertMany(empresas); // Inserta las empresas en la base de datos
    console.log('Empresas creadas con éxito');
  } catch (error) {
    console.error('Error al crear empresas', error);
  } finally {
    mongoose.connection.close(); // Cierra la conexión con la base de datos
  }
};

// Ejecuta el script
const ejecutarScript = async () => {
  await conectarDB();
  await crearEmpresas();
};

ejecutarScript();
