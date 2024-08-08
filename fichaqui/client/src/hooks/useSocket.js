import { useEffect } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Definir la URL del WebSocket desde las variables de entorno
const NEXT_PUBLIC_URL_WEBSOCKET = process.env.NEXT_PUBLIC_URL_WEBSOCKET;

const useSocket = (useruuid) => {
    useEffect(() => {
        const socket = io(NEXT_PUBLIC_URL_WEBSOCKET); // Asegúrate de que esta URL coincide con la de tu servidor API

        // Registra el useruuid con el servidor
        if (useruuid) {
            console.log(`Connecting with useruuid: ${useruuid}`);
            socket.emit('join', useruuid);
        }

        // Escucha el evento de notificación
        socket.on('notification', (data) => {
            console.log('Notificación recibida:', data);
            toast.success(data.message, {
                position: toast.POSITION.TOP_RIGHT,
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
    }, [useruuid]);
};

export default useSocket;
