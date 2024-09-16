"use client";
import { useState, useEffect, useRef } from "react";
import CardEmployed from "@/components/component/card-employed";
import { useRouter } from "next/navigation";
import QRScanner from "@/components/component/QRScanner";

const NEXT_PUBLIC_URL_API_AUTH = process.env.NEXT_PUBLIC_URL_API_AUTH;
const NEXT_PUBLIC_URL_API_PRESENTISMO = process.env.NEXT_PUBLIC_URL_API_PRESENTISMO;

export default function Page() {
  const [employeeDetails, setEmployeeDetails] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [scanning, setScanning] = useState(false); // Estado para controlar el escaneo
  const router = useRouter();
  const scannerRef = useRef(null); // Referencia al componente QRScanner

  const successSound = useRef(null);

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

      if (readingMode !== "camera") {
        router.push('/zone/reader/lectorQr');
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
  }, [router]);

  useEffect(() => {
    // Limpiar el estado de escaneo al desmontar el componente
    return () => {
      setScanning(false);
    };
  }, []);

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
      setError(error.message);  // Captura el error aquí
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

 const handleScan = async (data) => {
    if (data && data.text !== lastScannedCode && !scanning) {
      setScanning(true);
      const scannedCode = data.text;
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

        setLastScannedCode(scannedCode);
      } catch (error) {
        console.error('Error al fichar al empleado:', error);
        setMessage(error.message || 'Error al fichar al empleado');
      } finally {
        setScanning(false);
        if (scannerRef.current && scannerRef.current.resetScanner) {
          scannerRef.current.resetScanner();
        }
      }
    }
  };

  const handleError = (err) => {
    console.error(err);
    setError("Error al escanear el código QR. Inténtelo nuevamente.");
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-4 md:mr-4">
        <h1 className="text-2xl font-bold">Fichada</h1>
        <p className="text-gray-500 dark:text-gray-400">Escanea tu QR para poder fichar.</p>
        <div className="flex items-center justify-center p-1 bg-gray-100 rounded-lg dark:bg-gray-700">
          <QRScanner
            ref={scannerRef} // Referencia al componente QRScanner
            error={error}
            handleScan={handleScan}
            handleError={handleError}
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
