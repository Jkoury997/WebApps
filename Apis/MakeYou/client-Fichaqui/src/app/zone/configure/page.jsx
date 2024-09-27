"use client"
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { VideoIcon,ScanBarcodeIcon } from 'lucide-react';

export default function Page() {
    const router = useRouter();
    const [message, setMessage] = useState('');
  
    useEffect(() => {
      const checkModo = async () => {
        const readingMode = localStorage.getItem('readingMode');
        if (!readingMode) {
          router.push('/zone/configure');
          return;
        }
  
        if(readingMode === 'camera'){
            router.push('/zone/configure/lectorQr');
        }
        if(readingMode === 'reader'){
            router.push('/zone/configure/scanerQr');
          }
      };
  
      checkModo();
    }, [router]);
  
    const handleModeSelect = (mode) => {
        localStorage.setItem('readingMode', mode);
      setMessage(`Modo ${mode === 'camera' ? 'Cámara' : 'Lector'} seleccionado y guardado.`);
      if(mode === 'camera'){
        router.push('/zone/configure/lectorQr');
      }
      if(mode === 'reader'){
        router.push('/zone/configure/scanerQr');
      }
    };
  
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
      <div className="max-w-md w-full p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Configurar Lectura</h1>
          <p className="text-gray-500 dark:text-gray-400">Seleccione el modo de lectura.</p>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-8 bg-gray-100 rounded-lg dark:bg-gray-700">
            <Button onClick={() => handleModeSelect('camera')} className="w-full md:w-full flex items-center justify-center">
              <VideoIcon className="mr-2" /> Cámara
            </Button>
            <Button onClick={() => handleModeSelect('reader')} className="w-full md:w-full flex items-center justify-center">
              <ScanBarcodeIcon className="mr-2" /> Lector
            </Button>
          </div>
          {message && (
            <div className="text-center mt-4">
              <p>{message}</p>
            </div>
          )}
        </div>
      </div>
    </div>
    );
  }