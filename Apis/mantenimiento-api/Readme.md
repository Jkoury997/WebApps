# 🛠 API de Mantenimiento

Esta API permite gestionar empresas, zonas dentro de cada empresa y tareas de mantenimiento asignadas a cada zona.

## 🚀 Características
✅ CRUD de Empresas, Zonas y Tareas  
✅ Gestión de imágenes con `Multer` para tareas  
✅ WebSockets para actualización en tiempo real  
✅ Reportes sobre tiempos de finalización de tareas  
✅ Middleware centralizado para manejo de errores  
✅ Uso de UUID en lugar de ObjectId  
✅ Validaciones con `express-validator`  

---

## 📺 Estructura del Proyecto
```
📂 src/
│📂 config/          # Configuración de la base de datos
│📂 controllers/     # Controladores de Empresas, Zonas y Tareas
│📂 middlewares/     # Middleware de errores, validaciones y subida de archivos
│📂 models/          # Modelos de Mongoose
│📂 routes/          # Rutas de la API
│📂 services/        # Lógica de negocio separada en servicios
│📂 uploads/         # Almacenamiento local de imágenes
│📚 app.js              # Configuración de Express
│📚 server.js           # Servidor con WebSockets
│📚 .env                # Variables de entorno
│📚 package.json        # Dependencias y scripts
│📚 README.md           # Documentación
```

---

## ⚙️ Configuración

### 1️⃣ **Clonar el repositorio**
```bash
git clone https://github.com/tu-repo/api-mantenimiento.git
cd api-mantenimiento
```

### 2️⃣ **Instalar dependencias**
```bash
npm install
```

### 3️⃣ **Configurar variables de entorno**
Crear un archivo `.env` y agregar:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/mantenimiento
JWT_SECRET=supersecreto
```

### 4️⃣ **Iniciar el servidor**
```bash
npm start
```
o en modo desarrollo con `nodemon`:
```bash
npm run dev
```

---

## 👀 **Secuencia de cURL: Desde Crear una Empresa hasta Crear una Tarea**

### 🔹 **Paso 1: Crear una Empresa**
```bash
curl -X POST http://localhost:5000/api/empresas \
     -H "Content-Type: application/json" \
     -d '{"nombre": "Empresa A"}'
```
📌 **Respuesta esperada:**
```json
{
  "_id": "{empresaId}",
  "nombre": "Empresa A",
  "zonas": [],
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### 🔹 **Paso 2: Crear una Zona dentro de la Empresa**
```bash
curl -X POST http://localhost:5000/api/zonas \
     -H "Content-Type: application/json" \
     -d '{"nombre": "Zona 1", "empresa": "{empresaId}"}'
```
📌 **Respuesta esperada:**
```json
{
  "_id": "{zonaId}",
  "nombre": "Zona 1",
  "empresa": "{empresaId}",
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### 🔹 **Paso 3: Crear una Tarea dentro de la Zona**
```bash
curl -X POST http://localhost:5000/api/tareas \
     -H "Content-Type: application/json" \
     -d '{
           "descripcion": "Revisión de equipos",
           "categoria": "Mantenimiento Preventivo",
           "zona": "{zonaId}"
         }'
```
📌 **Respuesta esperada:**
```json
{
  "_id": "{tareaId}",
  "descripcion": "Revisión de equipos",
  "categoria": "Mantenimiento Preventivo",
  "estado": "Creada",
  "zona": "{zonaId}",
  "imagenes": [],
  "createdAt": "...",
  "updatedAt": "..."
}
```

---

### 🔹 **Paso 4: Actualizar el Estado de una Tarea**
```bash
curl -X PATCH http://localhost:5000/api/tareas/{tareaId} \
     -H "Content-Type: application/json" \
     -d '{"estado": "Realizada"}'
```
📌 **Respuesta esperada:**
```json
{
  "msg": "Estado actualizado",
  "tarea": {
    "_id": "{tareaId}",
    "estado": "Realizada",
    "updatedAt": "..."
  }
}
```

---

### 🔹 **Paso 5: Subir Evidencia a una Tarea**
```bash
curl -X POST http://localhost:5000/api/tareas/{tareaId}/evidencia \
     -H "Content-Type: multipart/form-data" \
     -F "imagenes=@ruta/imagen1.jpg" \
     -F "imagenes=@ruta/imagen2.jpg"
```
📌 **Respuesta esperada:**
```json
{
  "msg": "Evidencia subida correctamente",
  "imagenes": ["/uploads/imagen1.jpg", "/uploads/imagen2.jpg"]
}
```

---

🚀 **Ahora tu API permite la gestión completa de Empresas, Zonas y Tareas con actualización de estado y evidencia visual.**

