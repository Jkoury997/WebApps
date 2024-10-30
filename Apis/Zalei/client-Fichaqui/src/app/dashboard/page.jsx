"use client";

import { useEffect, useState } from "react";

import { QRPresentismo } from "@/components/component/qr-presentismo";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

export default function Page() {
    const [isVerified, setIsVerified] = useState(false); // Estado para controlar si la verificación ha finalizado

    // Función para generar la huella digital
    const generateFingerprint = async () => {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        return result.visitorId;
    };

    // useEffect para manejar la verificación de huella digital
    useEffect(() => {
        
        const verifyDevice = async () => {
            try {
                // Genera la huella digital
                const resultFingerprint = await generateFingerprint();
                console.log("Generated Fingerprint:", resultFingerprint);

                // Intentar verificar el dispositivo enviando la huella digital al backend
                const fingerprintResponse = await fetch(`/api/auth/trustdevice/verify`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        fingerprint: resultFingerprint,
                    }),
                });

                const fingerprintData = await fingerprintResponse.json();
                console.log("Fingerprint Data:", fingerprintData);

                // Redirigir al dashboard si el dispositivo es de confianza
                if (fingerprintData.isTrusted) {
                    setIsVerified(true);
                } else {
                    setIsVerified(true); // Solo marca como verificado si el dispositivo no es de confianza
                }
            } catch (error) {
                console.error("Error verifying device:", error);
            }
        };

        // Llama a la función de verificación de dispositivo cuando se monta el componente
        verifyDevice();
    }, []);

    return (
        <>
            {isVerified ? <QRPresentismo /> : <p>Verificando dispositivo...</p>}
        </>
    );
}
