const express = require('express');
const cors = require('cors');
const mainRoute = require('./routes/mainRoute');
const morgan = require('morgan');
const { errorHandler } = require('./utils/errorHandler');
const { PORT, CLIENT_URL} = require('./config/config');


const app = express();


// Middlewares
app.use(express.json());
app.use(cors({ origin: CLIENT_URL }));
app.use(morgan('dev'));

// Middleware para manejo de errores
app.use(errorHandler);

// Conectar a MongoDB y luego iniciar el servidor
connectDB().then(() => {
  app.use('/api', mainRoute);

  app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
  });
}).catch((error) => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});
