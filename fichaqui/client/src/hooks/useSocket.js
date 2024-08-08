// hooks/useSocket.js
import { useEffect } from 'react';
import io from 'socket.io-client';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NEXT_PUBLIC_URL_WEBSOCKET = process.env.NEXT_PUBLIC_URL_WEBSOCKET;

const useSocket = (useruuid) => {
    useEffect(() => {
        if (!useruuid) {
            console.warn('No useruuid provided');
            return;
        }

        const socket = io(NEXT_PUBLIC_URL_WEBSOCKET);

        console.log(`Connecting with useruuid: ${useruuid}`);
        socket.emit('join', useruuid);

        socket.on('notification', (data) => {
            console.log('Notificación recibida:', data);

            // Hacer vibrar el dispositivo por 200 milisegundos
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
    }, [useruuid]);
};

export default useSocket;
