// components/AttendanceFichadaScanner.jsx
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import QRScanner from '@/components/component/QRScanner';
import CardEmployed from '@/components/component/card-employed';
import { Alert } from '@/components/component/alert';
import { ExpandIcon } from 'lucide-react';
import { openFullscreen } from '@/utils/fullscreen';
import { registerAttendance, fetchEmployeeDetails } from "@/utils/services/attendance"; // Funciones API externalizadas

export default function AttendanceFichadaScanner() {
  const [zoneId, setZoneId] = useState(null);
  const [fichada, setFichada] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [error, setError] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [lastScannedCode, setLastScannedCode] = useState(null);
  const router = useRouter();
  const scannerRef = useRef(null);
  const successSound = useRef(null);

  // Verificar que exista el trustdevice y obtener la zona
  useEffect(() => {
    successSound.current = new Audio('/sounds/success.mp3');

    const checkTrustDevice = async () => {
      const trustdevice = localStorage.getItem("trustdevice");
      if (!trustdevice) {
        router.push("/zone/configure");
        return;
      }
      try {
        const response = await fetch(
          `/api/qrfichaqui/zones/find?trustdevice=${trustdevice}`
        );
        if (!response.ok) {
          throw new Error("Zona no encontrada");
        }
        const data = await response.json();
        console.log(data)
        if (data.error) throw new Error(data.error);
        setZoneId(data._id);
      } catch (error) {
        console.error("Error al obtener la zona:", error);
        localStorage.removeItem("trustdevice");
        router.push("/zone/configure");
      }
    };

    const checkModo = () => {
      const readingMode = localStorage.getItem("readingMode");
      if (!readingMode) {
        router.push("/zone/reader");
        return;
      }
    };

    checkTrustDevice();
    checkModo();
  }, [router]);

  // Función para manejar el escaneo del QR
  const handleScan = async (data) => {
    
    if (data && data.text !== lastScannedCode && !scanning) {
      setScanning(true);
      const scannedCode = data.text;
      try {
        const attendanceResponse = await registerAttendance(scannedCode, zoneId);
        if (attendanceResponse) {
          const employeeData = await fetchEmployeeDetails(attendanceResponse.userId);
          setFichada(attendanceResponse);
          setEmployee(employeeData);
        }
        successSound.current.play();
        setLastScannedCode(scannedCode);
        setAlertMessage({ type: 'success', message: 'Fichada exitosa.' });
      } catch (err) {
        console.error('Error al fichar al empleado:', err);
        setAlertMessage({ type: 'error', message: err.message });
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
    setAlertMessage({ type: 'error', message: err.message });
  };

  return (
    <div className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <button onClick={openFullscreen} className="absolute top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded">
        <ExpandIcon />
      </button>
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800 space-y-4 md:mr-4">
        <h1 className="text-2xl font-bold">Fichada</h1>
        <p className="text-gray-500 dark:text-gray-400">Escanea tu QR para fichar.</p>
        <div className="flex items-center justify-center p-1 bg-gray-100 rounded-lg dark:bg-gray-700">
          <QRScanner 
            ref={scannerRef}
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
