"use client";
import { useState, useEffect, useRef } from "react";
import CardEmployed from "@/components/component/card-employed";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/component/alert";

export default function Page() {
  const [zoneId, setZoneId] = useState(null);
  const [fichada, setFichada] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const router = useRouter();
  const successSound = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    successSound.current = new Audio('/sounds/success.mp3'); // Cargar el sonido de éxito

    const checkTrustDevice = async () => {
      const trustdevice = localStorage.getItem('trustdevice');
      if (!trustdevice) {
        router.push('/zone/configure');
        return;
      }

      try {
        const response = await fetch(`/api/qrfichaqui/zones/find?trustdevice=${trustdevice}`);
        if (!response.ok) {
          throw new Error('Zona no encontrada');
        }
        const data = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }
        setZoneId(data._id);
      } catch (error) {
        console.error('Error al obtener la zona:', error);
        localStorage.removeItem('trustdevice');
        router.push('/zone/configure');
      }
    };

    const checkModo = async () => {
      const readingMode = localStorage.getItem('readingMode');
      if (!readingMode) {
        router.push('/zone/configure');
        return;
      }
    };

    checkTrustDevice();
    checkModo();
  }, [router]);

  useEffect(() => {
    // Enfocar automáticamente el input al cargar la página
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleConfirmPresence = () => {
    setPageVisible(true);
  };

  async function registerAttendance(uuid) {
    setAlertMessage(null); // Limpiar mensaje antes de registrar nueva asistencia
    try {
      const response = await fetch('/api/qrfichaqui/attendance/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ uuid, zoneId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al registrar asistencia');
      }
      setFichada(data);
      return data;
    } catch (error) {
      console.log(error);
      setAlertMessage({
        type: "error",
        message: error.message,
      }); // Actualiza el estado del error
      throw error;
    }
  }

  async function fetchEmployeeDetails(userId) {
    try {
      const response = await fetch(`/api/auth/info/user?userId=${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json(); // Obtener los detalles del error del servidor
        throw new Error(errorData.message || 'Error al obtener los detalles del empleado');
      }
      const data = await response.json();
      setEmployee(data);
      return data;
    } catch (error) {
      console.error('Error al obtener los detalles del empleado:', error);
      throw new Error(error.message || 'Error al obtener los detalles del empleado');
    }
  }

  const handleScan = async (scannedCode) => {
    scannedCode = scannedCode.replace(/'/g, "-"); // Reemplazar caracteres no válidos

    if (scannedCode && !scanning) {
      setScanning(true);
      try {
        const attendanceResponse = await registerAttendance(scannedCode);
        if (attendanceResponse) {
          await fetchEmployeeDetails(attendanceResponse.userId);
        }

        setAlertMessage({
          type: "success",
          message: "Fichada exitosa.",
        });

        successSound.current.play();

        inputRef.current.value = ''; // Limpia el campo de entrada después de escanear
      } catch (error) {
        console.error('Error al fichar al empleado:', error);
        setAlertMessage({
          type: "error",
          message: error.message,
        });
      } finally {
        setScanning(false);
        inputRef.current.value = ''; // Asegura que el campo se limpia después del escaneo
        inputRef.current.focus(); // Asegura que el campo de entrada mantenga el enfoque
      }
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus(); // Enfocar el campo de entrada si se toca la pantalla
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4"
      onClick={handleClick} // Enfocar el input al hacer clic en cualquier parte de la pantalla
    >
      {!pageVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="text-center text-gray-700">La página no está visible. Haga clic para continuar.</p>
            <button
              onClick={handleConfirmPresence}
              className="mt-4 w-full bg-blue-500 text-white py-2 rounded"
            >
              Estoy aquí
            </button>
          </div>
        </div>
      )}
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-4 md:mr-4">
        <h1 className="text-2xl font-bold">Fichada</h1>
        <p className="text-gray-500 dark:text-gray-400">Escanea tu QR para poder fichar.</p>
        <div className="flex items-center justify-center p-1 bg-gray-100 rounded-lg dark:bg-gray-700">
          <input
            ref={inputRef}
            type="text"
            className="w-full p-2 bg-white rounded dark:bg-gray-800"
            placeholder="Escanea el código QR aquí"
            autoFocus // Asegura que el input esté enfocado al cargar la página
            onChange={(e) => handleScan(e.target.value)} // Llamar a handleScan cuando cambie el valor del input
          />
        </div>
        {alertMessage && (
          <Alert
            type={alertMessage.type}
            title={alertMessage.type === "error" ? "Error" : "Éxito"}
            message={alertMessage.message}
            onClose={() => setAlertMessage(null)}
            className="mb-2"
          />
        )}
      </div>
      {employee && (
        <div className="mt-3 w-full max-w-md">
          <CardEmployed employee={employee} fichada={fichada} />
        </div>
      )}
    </div>
  );
}
