// services/attendance.js
export async function registerAttendance(uuid, zoneId) {
    const response = await fetch('/api/qrfichaqui/attendance/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ uuid, zoneId }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al registrar asistencia');
    }
    return data;
  }
  
  export async function fetchEmployeeDetails(userId) {
    const response = await fetch(`/api/auth/info/user?userId=${userId}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Error al obtener detalles del empleado');
    }
    return data;
  }
  