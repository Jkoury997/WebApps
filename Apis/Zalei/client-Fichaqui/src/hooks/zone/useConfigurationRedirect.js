// hooks/useConfigurationRedirect.js
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export function useConfigurationRedirect() {
  const router = useRouter();

  useEffect(() => {
    const checkTrustDevice = async () => {
      const trustdevice = localStorage.getItem('trustdevice');
      if (!trustdevice) {
        router.push('/zone/configure');
        return false;
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
        return true;
      } catch (error) {
        console.error('Error al obtener la zona:', error);
        localStorage.removeItem('trustdevice');
        router.push('/zone/configure');
        return false;
      }
    };

    const checkReadingMode = () => {
      const readingMode = localStorage.getItem('readingMode');
      if (!readingMode) {
        return;
      }
      if (readingMode === 'camera') {
        router.push('/zone/reader/scanerQr');
      } else if (readingMode === 'reader') {
        router.push('/zone/reader/lectorQr');
      }
    };

    // Primero se verifica el trustdevice y, si es válido, se verifica el modo de lectura
    checkTrustDevice().then((configured) => {
      if (configured) {
        checkReadingMode();
      }
    });
  }, [router]);
}
