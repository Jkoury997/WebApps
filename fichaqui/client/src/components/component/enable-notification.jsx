import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import Cookies from 'js-cookie';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import io from 'socket.io-client';

const NEXT_PUBLIC_URL_WEBSOCKET = process.env.NEXT_PUBLIC_URL_WEBSOCKET;

export function EnableNotification({ setIsEnabled }) {
  const [useruuid, setUseruuid] = useState(null);

  useEffect(() => {
    const uuid = Cookies.get('useruuid');
    setUseruuid(uuid);
    console.log(`useruuid: ${uuid}`);
  }, []);

  const enableNotifications = () => {
    setIsEnabled(true);

    const socket = io(NEXT_PUBLIC_URL_WEBSOCKET);

    console.log(`Connecting with useruuid: ${useruuid}`);
    socket.emit('join', useruuid);

    socket.on('notification', (data) => {
      console.log('Notificación recibida:', data);

      if ('vibrate' in navigator) {
        navigator.vibrate(200);
      }

      toast.success(data.message, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    });

    socket.on('connect', () => {
      console.log('WebSocket connected');
    });

    socket.on('disconnect', () => {
      console.log('WebSocket disconnected');
    });

    socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error);
    });

    return () => {
      socket.disconnect();
    };
  };

  return (
    <div
      className="max-w-md w-full p-6 bg-white dark:bg-gray-700 rounded-lg shadow-md"
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <div className="space-y-4">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Estado de actividad</h1>
        <p className="text-gray-600 dark:text-gray-400">
          Necesitamos saber que estas activo.
        </p>
        <Button
          className="w-full"
          onClick={enableNotifications}
        >
          Estoy aqui
        </Button>
        <ToastContainer />
      </div>
    </div>
  );
}
