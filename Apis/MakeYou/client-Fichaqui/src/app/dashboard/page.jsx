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

                // Guardar el fingerprint en localStorage solo si no existe
                if (!localStorage.getItem("localFingerprint")) {
                    localStorage.setItem("localFingerprint", resultFingerprint);
                    console.log("Fingerprint guardado en localStorage:", resultFingerprint);
                } else {
                    console.log("Fingerprint ya existe en localStorage:", localStorage.getItem("localFingerprint"));
                }

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

                // Si la verificación inicial es exitosa
                if (fingerprintData.isTrusted) {
                    setIsVerified(true);
                } else {
                    // Si falla, realizar la verificación extra
                    console.log("Realizando verificación extra...");
                    const localFingerprint = localStorage.getItem("localFingerprint")
                    const extraVerificationResponse = await fetch(`/api/auth/trustdevice/verifyextra`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            localFingerprint: localFingerprint,
                            newFingerprint: resultFingerprint
                        }),
                    });

                    const extraVerificationData = await extraVerificationResponse.json();
                    console.log("Extra Verification Data:", extraVerificationData);

                    if (extraVerificationData.isTrusted) {
                        localStorage.setItem("localFingerprint", resultFingerprint);
                        setIsVerified(true);
                    } else {
                        setIsVerified(true); // Falló la verificación extra
                    }
                }
            } catch (error) {
                console.error("Error verifying device:", error);
                setIsVerified(true); // Manejo de errores
            }
        };

        // Llama a la función de verificación de dispositivo cuando se monta el componente
        verifyDevice();
    }, []);

    return (
        <>
            {isVerified ? (
                <QRPresentismo />
            ) : (
                <p>Verificando dispositivo...</p>
            )}
        </>
    );
}
