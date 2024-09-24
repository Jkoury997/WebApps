"use client"
import { StepIndicator } from "@/components/component/step-indicartor";
import { useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import Input from "@/components/ui/input";
import QrScannerComponent from "@/components/component/qr-scanner";



export default function Page () {
    const [activeStep,setActiveStep] = useState(1)
    const [alertMessage, setAlertMessage] = useState(null);
    const [scanned, setScanned] = useState(false); // Estado para verificar si el escaneo se realizó
    const [loading, setLoading] = useState(false); // Estado para indicar si está cargando

    const handleScan = async (data) => {
        if (data) {
            console.log(data)
            try {
                setScanned(false); // Reiniciar el estado de escaneo
                const parsedData = JSON.parse(data);

                    console.log('API Result:', parsedData);


                    setScanned(true); // Escaneo y fetch exitosos

            } catch (error) {
                console.error('Error:', error);
                setScanned(false); // Reiniciar si ocurre un error
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        }
    };

    return(
        <>
            <div className="mb-3 flex flex-col items-center">
                <StepIndicator activeStep={activeStep} steps={4} />
            </div>

            <div className="mb-2 flex flex-col items-center">
                <h1 className="text-2xl font-bold mb-2 text-center">Mover Bolsa</h1>
                <p className="text-muted-foreground text-center">
                Utiliza este formulario para mover una Bolsa.
                </p>
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

            {activeStep === 1 && (
                    <Card className="mt-2">
                            <CardHeader>
                            <CardTitle className="ms-2">Qr del Personal</CardTitle>
                        <CardDescription className="ms-2"
                        >Scanea el codigo el personal</CardDescription>
                        </CardHeader>
                    <CardContent>
                    <QrScannerComponent onScanSuccess={handleScan}></QrScannerComponent>


                    </CardContent>
                    </Card>
                )}
        </>
    )
}
