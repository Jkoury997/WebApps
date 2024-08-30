"use client";

import { useState,useEffect } from "react";
import { ScanBarcode } from "@/components/component/scan-barcode";
import { EnterGalpon } from "@/components/component/enter-galpon";
import { EnterQuantity } from "@/components/component/enter-quantity";
import { ArticleDetails } from "@/components/ui/articules-details";
import dynamic from "next/dynamic"; // Para carga dinámica de componentes
import { Card, CardContent } from "@/components/ui/card";
import { StepIndicator } from "@/components/component/step-indicartor";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import shortUUID from "short-uuid";

// Carga dinámica del componente QrPrinter, que solo se carga en el cliente
const QrPrinter = dynamic(() => import('@/components/component/qr-pdf-generator'), { ssr: false });


export default function Page() {
    const [isFirstScanComplete, setIsFirstScanComplete] = useState(false);
    const [activeStep, setActiveStep] = useState(1);
    const [galpon, setGalpon] = useState("");
    const [cantidad, setCantidad] = useState("");
    const [dataArticulo, setDataArticulo] = useState(null);
    const [qrData, setQrData] = useState(null); // Nuevo estado para los datos del QR
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null); // Nuevo estado para manejar mensajes de éxito

    useEffect(() => {
        const handleBeforeUnload = (event) => {
          if (isFirstScanComplete) {
            event.preventDefault();
            event.returnValue = ""; // Es necesario para mostrar la alerta en algunos navegadores
          }
        };
    
        window.addEventListener("beforeunload", handleBeforeUnload);
    
        return () => {
          window.removeEventListener("beforeunload", handleBeforeUnload);
        };
      }, [isFirstScanComplete]);

      

    const handleScan = async (decodedText) => {
        setError(null); // Resetear errores previos
        console.log("Código escaneado:", decodedText);
        try {
            const response = await fetch('/api/syndra/catalogo/articulo', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ Codebar: decodedText }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log(result);
                setDataArticulo(result);
                setActiveStep(2);
                setIsFirstScanComplete(true); // Marcamos que el primer escaneo se ha completado
            } else {
                setError(result.error || 'Error al obtener los datos del artículo');
            }
        } catch (err) {
            setError('Error durante la solicitud a la API');
        }
    };

    const handlePrevious = () => {
        setActiveStep(prev => prev - 1);
    };

    const handleCreate = async (IdArticulo, Cantidad) => {
        setError(null); // Resetear errores previos
        try {
            const response = await fetch('/api/syndra/avicola/cajon/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ IdArticulo, Cantidad }),
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Cajón creado con éxito:', result);
                const uuid = shortUUID.generate();
                const qrDataObject = {
                    uuid:uuid,
                    IdArticulo,
                    Cantidad,
                    Galpon: galpon,
                    IdPaquete:result.IdPaquete,
                    Fecha: new Date().toLocaleDateString('es-AR'),
                };
                setQrData(JSON.stringify(qrDataObject));
                setSuccess('El cajón ha sido creado con éxito.');
                setActiveStep(4);
            } else {
                setError(result.error || 'Error al crear el cajón');
            }
        } catch (err) {
            setError('Error durante la creación del cajón');
        }
    };

    const handleCreateAnother = () => {
        // Recargar la página para crear un nuevo cajón
        setCantidad("")
        setGalpon("")
        setSuccess("")
        setError("")
        setQrData("")
        setDataArticulo("")
        setActiveStep(1)

    };

    return (
        <div className="container mx-auto px-2 py-8">
            <div className="max-w-2xl mx-auto">
                <div className="mb-6 flex flex-col items-center">
                    <StepIndicator activeStep={activeStep} />
                    <h1 className="text-3xl font-bold mb-2 text-center">Crear Cajón</h1>
                    <p className="text-muted-foreground text-center">
                        Utiliza este formulario para crear un nuevo cajón en el sistema.
                    </p>
                </div>
                {error && (
                    <div className="mb-6">
                        <Alert type="error" title="Error" message={error} />
                    </div>
                )}
                {success && (
                    <div className="mb-6">
                        <Alert type="success" title="Éxito" message={success} />
                    </div>
                )}
                <Card>
                    <CardContent className="grid gap-4 p-1 pt-6">
                        {activeStep === 1 && <ScanBarcode onScan={handleScan} />}
                        {activeStep === 2 && (
                            <>
                                <ArticleDetails dataArticulo={dataArticulo} Galpon={galpon} />
                                <EnterGalpon 
                                    Galpon={galpon} 
                                    setGalpon={setGalpon} 
                                    onPrevious={handlePrevious}
                                    onNext={() => setActiveStep(3)}
                                />
                            </>
                        )}
                        {activeStep === 3 && (
                            <>
                                <ArticleDetails dataArticulo={dataArticulo} Galpon={galpon} Cantidad={cantidad} />
                                <EnterQuantity 
                                    Cantidad={cantidad} 
                                    setCantidad={setCantidad} 
                                    Galpon={galpon} 
                                    IdArticulo={dataArticulo?.Articulo?.IdArticulo}
                                    onPrevious={handlePrevious}
                                    onCreate={handleCreate} 
                                />
                            </>
                        )}
                        {activeStep === 4 && (
                            <>
                                <QrPrinter qrData={qrData} apiResponse={dataArticulo} />
                                <Button 
                                    className="mt-1 bg-white text-gray-950 border-gray-950 border rounder hover:text-white" 
                                    onClick={handleCreateAnother}
                                >
                                    Crear otro Cajón
                                </Button>
                            </>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}