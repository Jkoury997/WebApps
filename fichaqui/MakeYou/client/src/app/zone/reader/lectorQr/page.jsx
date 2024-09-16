"use client";
import { useState, useEffect, useRef } from "react";
import CardEmployed from "@/components/component/card-employed";
import { useRouter } from "next/navigation";

const NEXT_PUBLIC_URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;
const NEXT_PUBLIC_URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO;

export default function Page() {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const router = useRouter();
  const successSound = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    successSound.current = new Audio('/sounds/success.mp3'); // Cargar el sonido de éxito

    const checkZoneUUID = async () => {
      const zoneUUID = localStorage.getItem('zoneUUID');
      const readingMode = localStorage.getItem('readingMode');
      if (!zoneUUID) {
        router.push('/zone/configure');
        return;
      }

      if (!readingMode) {
        router.push('/zone/reader');
        return;
      }

      if (readingMode !== "reader") {
        router.push('/zone/reader/scanerQr');
        return;
      }

      try {
        const response = await fetch(`/api/presentismo/zones/find?uuid=${zoneUUID}`);
        if (!response.ok) {
          throw new Error('Zona no encontrada');
        }
        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }
      } catch (error) {
        console.error('Error al obtener la zona:', error);
        localStorage.removeItem('zoneUUID');
        sessionStorage.removeItem('zoneUUID');
        router.push('/zone/configure');
      }
    };

    checkZoneUUID();

    const handleKeydown = async (event) => {
      if (event.key === 'Enter' && inputRef.current.value) {
        handleScan(inputRef.current.value);
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setPageVisible(false); // La página no está visible
      } else {
        setPageVisible(true); // La página está visible
      }
    };

    // Detectar clics en cualquier lugar de la página
    const handleDocumentClick = () => {
      if (inputRef.current) {
        inputRef.current.focus(); // Enfocar el input cuando se haga clic en cualquier parte
      }
    };

    document.addEventListener('keydown', handleKeydown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('click', handleDocumentClick);

    return () => {
      document.removeEventListener('keydown', handleKeydown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('click', handleDocumentClick);
    };
  }, [router]);

  const handleConfirmPresence = () => {
    setPageVisible(true);
  };

  async function registerAttendance(code, location) {
    try {
      const response = await fetch('/api/presentismo/attendance/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, location }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData.message)
        throw new Error(errorData.error || 'Error al fichar');
      }

      return await response.json();
    } catch (error) {
      setError(error.message);
      throw error;
    }
  }

  async function fetchEmployeeDetails(useruuid) {
    const response = await fetch(`/api/auth/user?useruuid=${useruuid}`);

    if (!response.ok) {
      throw new Error('Error al obtener los detalles del empleado');
    }

    return await response.json();
  }

  const handleScan = async (scannedCode) => {

    scannedCode = scannedCode.replace(/'/g, "-");

    if (scannedCode && !scanning) {
      setScanning(true);
      console.log(scannedCode)
      try {
        const location = localStorage.getItem('zoneUUID');
        if (!location) {
          setMessage('Zona no configurada. Por favor configure la zona primero.');
          setScanning(false);
          return;
        }

        const attendanceResponse = await registerAttendance(scannedCode, location);

        const employeeDetails = await fetchEmployeeDetails(attendanceResponse.useruuid);

        setEmployeeDetails(attendanceResponse);
        setEmployee(employeeDetails);
        setMessage(` ${employeeDetails.firstName} ${employeeDetails.lastName} fichada correcta`);

        successSound.current.play();

        inputRef.current.value = ''; // Limpia el campo de entrada después de escanear
      } catch (error) {
        console.error('Error al fichar al empleado:', error);
        setMessage(error.message || 'Error al fichar al empleado');
        inputRef.current.value = ''; // Limpia el campo de entrada después de escanear
      } finally {
        setScanning(false);
        inputRef.current.value = ''; // Limpia el campo de entrada después de escanear
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
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
          />
        </div>
        {message && (
          <div className="text-center mt-4">
            <p>{message}</p>
          </div>
        )}
      </div>
      {employee && (
        <div className="mt-3 w-full max-w-md">
          <CardEmployed employee={employee} employeeDetails={employeeDetails} />
        </div>
      )}
    </div>
  );
}