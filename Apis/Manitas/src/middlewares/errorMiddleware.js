// errorMiddleware.js

const errorMiddleware = (err, req, res, next) => {
    console.error(err.stack); // Esto es útil para el registro del error en el servidor
  
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; // Si no se ha establecido un status code, se usa 500 por defecto
    res.status(statusCode);
  
    res.json({
      error: {
        message: err.message || 'Ocurrió un error en el servidor',
        status: statusCode,
      }
    });
  };
  
  module.exports = errorMiddleware;
  