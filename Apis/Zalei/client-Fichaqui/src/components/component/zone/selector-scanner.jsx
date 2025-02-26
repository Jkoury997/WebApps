import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { VideoIcon, ScanBarcodeIcon } from 'lucide-react';

export default function ScanModeSelector() {
  const router = useRouter();

  const handleModeSelect = (mode) => {
    // Guarda el modo de lectura en localStorage
    localStorage.setItem('readingMode', mode);
    // Redirige a la ruta de configuración según el modo seleccionado
    if (mode === 'camera') {
      router.push('/zone/configure/scanerQr');
    } else if (mode === 'reader') {
      router.push('/zone/configure/lectorQr');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="text-2xl font-bold">Configurar Lectura</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Seleccione el modo de lectura.
        </p>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-8 bg-gray-100 rounded-lg dark:bg-gray-700">
          <Button onClick={() => handleModeSelect('camera')} className="w-full flex items-center justify-center">
            <VideoIcon className="mr-2" /> Cámara
          </Button>
          <Button onClick={() => handleModeSelect('reader')} className="w-full flex items-center justify-center">
            <ScanBarcodeIcon className="mr-2" /> Lector
          </Button>
        </div>
      </div>
    </div>
  );
}
