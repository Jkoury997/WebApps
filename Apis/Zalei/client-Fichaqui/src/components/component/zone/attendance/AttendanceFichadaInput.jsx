"use client";
import { useState, useEffect, useRef } from "react";
import CardEmployed from "@/components/component/card-employed";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/component/alert";
import { ExpandIcon } from "lucide-react";
import { openFullscreen } from "@/utils/fullscreen"; // Función extraída a un utilitario
import { registerAttendance, fetchEmployeeDetails } from "@/utils/services/attendance"; // Funciones API externalizadas

function Spinner() {
  return (
    <svg
      className="animate-spin h-5 w-5 text-gray-600"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      ></path>
    </svg>
  );
}

export default function AttendanceFichadaInput() {
  const [zoneId, setZoneId] = useState(null);
  const [fichada, setFichada] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [pageVisible, setPageVisible] = useState(true);
  const router = useRouter();
  const successSound = useRef(null);
  const inputRef = useRef(null);

  // Verifica trustdevice y modo de lectura al montar
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

  // Enfoca el input al montar
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  const handleConfirmPresence = () => {
    setPageVisible(true);
  };

  const handleScan = async (scannedCode) => {
    // Reemplaza caracteres inválidos en el código
    scannedCode = scannedCode.replace(/[´_,’'–—\s]/g, "-");
    if (scannedCode && !scanning) {
      setScanning(true);
      try {
        // Registra la asistencia y obtiene la respuesta
        const attendanceResponse = await registerAttendance(scannedCode, zoneId);
        if (attendanceResponse) {
          const employeeData = await fetchEmployeeDetails(attendanceResponse.userId);
          setFichada(attendanceResponse);
          setEmployee(employeeData);
        }
        successSound.current.play();
        setAlertMessage({ type: "success", message: "Fichada exitosa." });
      } catch (error) {
        console.error("Error al fichar al empleado:", error);
        setAlertMessage({ type: "error", message: error.message });
      } finally {
        setScanning(false);
        if (inputRef.current) {
          inputRef.current.value = "";
          setTimeout(() => {
            inputRef.current.focus();
          }, 100);
        }
      }
    }
  };

  const handleClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <div
      className="flex flex-col md:flex-row items-center justify-center h-screen bg-gray-100 dark:bg-gray-900 p-4"
      onClick={handleClick}
    >
      <button
        onClick={openFullscreen}
        className="absolute top-4 right-4 bg-blue-500 text-white py-2 px-4 rounded"
      >
        <ExpandIcon />
      </button>
      {!pageVisible && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md">
            <p className="text-center text-gray-700">
              La página no está visible. Haga clic para continuar.
            </p>
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
        <p className="text-gray-500 dark:text-gray-400">
          Escanea tu QR para poder fichar.
        </p>
        <div className="relative flex items-center justify-center p-1 bg-gray-100 rounded-lg dark:bg-gray-700">
          <input
            ref={inputRef}
            inputMode="none"
            type="text"
            disabled={scanning}
            placeholder="Escanea el código QR aquí"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleScan(e.target.value);
              }
            }}
            className="w-full p-2 bg-white rounded dark:bg-gray-800"
          />
          {scanning && (
            <div className="absolute right-2">
              <Spinner />
            </div>
          )}
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
