"use client";
import { useState, useEffect, useRef } from "react";
import CardEmployed from "@/components/component/card-employed";
import { useRouter } from "next/navigation";
import QRScanner from "@/components/component/QRScanner";
import { Alert } from "@/components/component/alert";
import useGeolocation from "@/hooks/useGeolocation";
import { ExpandIcon } from "lucide-react";

function openFullscreen() {
  const elem = document.documentElement; // Puedes cambiar a un elemento específico
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { /* Safari */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { /* IE11 */
    elem.msRequestFullscreen();
  }
}



export default function Page() {
  const [zoneId, setZoneId] = useState(null);
  const [fichada, setFichada] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [error,setError] = useState(null)
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const [scanning, setScanning] = useState(false); // Estado para controlar el escaneo
  const router = useRouter();
  const scannerRef = useRef(null); // Referencia al componente QRScanner

  const successSound = useRef(null);

  const { location, errorlocation } = useGeolocation();

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
    // Limpiar el estado de escaneo al desmontar el componente
    return () => {
      setScanning(false);
    };
  }, []);

  async function registerAttendance(uuid) {
    console.log(uuid)
    setAlertMessage(""); // Limpiar mensaje antes de registrar nueva asistencia
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
      setFichada(data)
      return data;
    } catch (error) {
      console.log(error)
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
  
      // Verificar si la respuesta es exitosa
      if (!response.ok) {
        const errorData = await response.json(); // Obtener los detalles del error del servidor
        throw new Error(errorData.message || 'Error al obtener los detalles del empleado');
      }
      const data = await response.json();
      setEmployee(data)
      // Devolver los datos si la respuesta es exitosa
      return data
    } catch (error) {
      // Capturar y lanzar el error con un mensaje más claro
      console.error('Error al obtener los detalles del empleado:', error);
      throw new Error(error.message || 'Error al obtener los detalles del empleado');
    }
  }
  

  const handleScan = async (data) => {
    setError(null); // Limpiar cualquier error anterior
    if (data && data.text !== lastScannedCode && !scanning) {
      setScanning(true);
      const scannedCode = data.text;
      try {
        const attendanceResponse = await registerAttendance(scannedCode);

        if(attendanceResponse){
          console.log(attendanceResponse)
          await fetchEmployeeDetails(attendanceResponse.userId)
        }
        
        successSound.current.play();
        setLastScannedCode(scannedCode);
        setAlertMessage({
          type: "success",
          message: "Fichada exitosa.",
        });

      } catch (error) {
        console.error('Error al fichar al empleado:', error);
        setAlertMessage({
          type: "error",
          message: error.message,
        });
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
    setAlertMessage({
      type: "error",
      message: err.message,
    });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
          <button
            onClick={openFullscreen}
            className="absolute top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded"
          >
           <ExpandIcon></ExpandIcon>
          </button>
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
