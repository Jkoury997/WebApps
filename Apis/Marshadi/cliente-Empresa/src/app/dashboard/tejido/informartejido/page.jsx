"use client"
import { useState } from "react";
import QrScannerComponent from "@/components/component/qr-scanner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Details } from "@/components/ui/details";
import { Alert } from "@/components/ui/alert"; // Asegúrate de importar tu componente de alerta

export default function Page() {
    const [qrData, setQrData] = useState(null); // Estado para el valor escaneado del QR
    const [cantidad, setCantidad] = useState(""); // Estado para el valor del input
    const [loading, setLoading] = useState(false); // Estado para indicar si está cargando
    const [maquina, setMaquina] = useState(null); // Estado para la información de la máquina
    const [scanned, setScanned] = useState(false); // Estado para verificar si el escaneo se realizó
    const [alertMessage, setAlertMessage] = useState(null); // Estado para el mensaje de la alerta

    const handleScan = async (data) => {
        if (data) {
            console.log(data)
            try {
                setScanned(false); // Reiniciar el estado de escaneo
                const parsedData = JSON.parse(data);

                if (parsedData.CodMaquina) {
                    const codMaquina = parsedData.CodMaquina.trim(); // Extraer CodMaquina y eliminar espacios
                    setQrData(codMaquina);
                    setLoading(true); // Indicamos que está cargando
                
                    // Realizar la solicitud fetch con el CodMaquina como ID
                    const response = await fetch(`/api/zyra/catalogo/maquina?id=${codMaquina}`, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                        },
                    });
                    
                    if (!response.ok) {
                        throw new Error('Error fetching data');
                    }

                    const result = await response.json();
                    console.log('API Result:', result);

                    // Asignar la información de la máquina al estado y marcar el escaneo como exitoso
                    setMaquina(result.Maquina || null);
                    setScanned(true); // Escaneo y fetch exitosos
                } else {
                    console.error('El código QR no contiene un CodMaquina válido');
                    setMaquina(null);
                    setScanned(false);
                }
            } catch (error) {
                console.error('Error:', error);
                setMaquina(null);
                setScanned(false); // Reiniciar si ocurre un error
            } finally {
                setLoading(false); // Finaliza el estado de carga
            }
        }
    };

    const handleInputChange = (e) => {
        setCantidad(e.target.value);
    };

    const handleSubmit = async () => {
        if (!isFormComplete || loading) return; // Asegurarse de que el formulario esté completo
    
        setLoading(true); // Activar el estado de carga
    
        try {
            // Realizar la solicitud fetch con el CodMaquina como ID
            const response = await fetch(`/api/zyra/medias/informartejido?CodMaquina=${maquina.CodMaquina.trim()}&Producido=${cantidad}`, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
            });
    
            const result = await response.json();
            console.log('API Result:', result);
    
            // Verificar si la API devolvió un error en los datos
            if (result.error || result.Estado === false) {
                // Mostrar alerta de error con el mensaje devuelto por la API
                setAlertMessage({
                    type: "error",
                    message: result.mensaje || result.Mensaje || 'Ocurrió un error al procesar la solicitud.'
                });
            } else {
                // Mostrar alerta de éxito si no hubo error
                setAlertMessage({
                    type: "success",
                    message: 'Datos enviados correctamente'
                });
    
                // Reiniciar el formulario solo si no hubo errores
                setQrData(null);
                setCantidad("");
                setMaquina(null);
                setScanned(false);
            }
    
        } catch (error) {
            console.error('Error:', error);
            setAlertMessage({
                type: "error",
                message: 'Hubo un error al enviar los datos.'
            });
        } finally {
            setLoading(false); // Finaliza el estado de carga
        }
    };
    

    const isFormComplete = qrData && cantidad > 0; // El botón solo estará habilitado si ambos campos están completos

    return (
<> 
            <div className="mb-2 flex flex-col items-center">
            <h1 className="text-2xl font-bold mb-2 text-center">Informar Tejido</h1>
            <p className="text-muted-foreground text-center">
            Utiliza este formulario para informar un tejido.
            </p>
        </div>
        <Card>
            <CardContent>
                
                {/* Componente de alerta */}
                {alertMessage && (
                  <Alert 
                    type={alertMessage.type} 
                    title={"Error"}
                    message={alertMessage.message} 
                    onClose={() => setAlertMessage(null)} 
                  />
                )}

                <QrScannerComponent title={"Qr Maquina"} description={"Escanear el qr de la maquina"} onScanSuccess={handleScan} />

                {/* Renderizar detalles de la máquina si el escaneo y fetch son exitosos */}
                {scanned && maquina && 
                <>
                    <Details details={maquina} />
                    <div className="flex flex-col sm:flex-row w-full max-w-sm space-y-2 sm:space-y-0 sm:space-x-2">
                        <div className="w-full text-left">
                            <Label>Cantidad</Label>
                        </div>
                        <Input
                            placeholder="Introducir la cantidad de tubos"
                            type="number"
                            value={cantidad}
                            onChange={handleInputChange}
                            min="1"
                        />

                        <Button type="submit" className="w-full" disabled={!isFormComplete || loading} onClick={handleSubmit}>
                            {loading ? 'Cargando...' : 'Cargar'}
                        </Button>
                    </div>
                </>
                }

            </CardContent>
        </Card>
        </>
    );
}
