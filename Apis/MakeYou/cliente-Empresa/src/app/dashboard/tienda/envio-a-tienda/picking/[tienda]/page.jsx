"use client";

import { useParams } from "next/navigation";
import React, { useState, useRef, useEffect } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Barcode,
  Scan,
  PackageCheck,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import Loading from "@/components/ui/loading";

export default function Component() {

  const { tienda } = useParams();
  const [loading, setLoading] = useState(true); // Estado de carga
  const [scannedItems, setScannedItems] = useState({});
  const [barcode, setBarcode] = useState("");
  const [errorProduct, setErrorProduct] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [products, setProducts] = useState([]);
  const inputRef = useRef(null);
  const dialogInputRef = useRef(null);
  const productRefs = useRef({});
  const [selectedRubro, setSelectedRubro] = useState(""); // Estado para el rubro seleccionado



  const fetchTienda = async (tienda) => {
    try {
      const response = await fetch(`/api/lux/envios/consultarenvio?tienda=${tienda}`);
      const data = await response.json();
      const filteredProducts = data.Articulos.filter(
        (product) => product.Stock > 0
      ).map((product) => ({ ...product, Saldo: Math.abs(product.Saldo) }));

      setProducts(filteredProducts);
      console.log(filteredProducts);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false); // Esto se ejecuta sin importar el resultado del try/catch
    }
  };

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (Object.keys(scannedItems).length > 0) {
        event.preventDefault();
        event.returnValue = ""; // Necesario para que algunos navegadores muestren la advertencia
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Limpieza: Remover el evento cuando ya no sea necesario
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [scannedItems]);

  useEffect(() => {
    if (tienda) fetchTienda(tienda);
  }, [tienda]);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [barcode, scannedItems, isDialogOpen]);

  // Condición para mostrar el componente de carga
  if (loading) {
    return <Loading />; // Muestra el componente de carga si loading es true
  }

  const handleScan = (e) => {
    e.preventDefault();
    processScan(barcode);
    setBarcode("");
  };

  const processScan = (code) => {
    const product = products.find((p) => p.CodigoBarras === code);
    if (product) {
      if (scannedItems[code] && scannedItems[code].Cantidad >= product.Saldo) {
        // Producto ya escaneado hasta su máximo - abrir diálogo para eliminar
        setErrorProduct(code);
        setIsDialogOpen(true);
      } else {
        // Agregar una unidad si aún no se ha alcanzado la cantidad máxima
        setScannedItems((prev) => ({
          ...prev,
          [code]: {
            IdArticulo: product.IdArticulo,
            CodigoBarras: code,
            Cantidad: (prev[code]?.Cantidad || 0) + 1,
          },
        }));

        productRefs.current[code]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      // Producto no está en la lista - abrir diálogo
      setErrorProduct(code);
      setIsDialogOpen(true);
    }
    setBarcode("");
  };

  const handleRescanToRemove = (code) => {
    // Simplemente cierra el diálogo al escanear nuevamente el mismo código sin modificar la cantidad
    if (code === errorProduct) {
      setIsDialogOpen(false);
      setErrorProduct(null);
    }
  };

  const handleForceAdd = () => {
    const product = products.find((p) => p.CodigoBarras === errorProduct);
    // Aumenta en 1 la cantidad del producto en el escaneo
    setScannedItems((prev) => ({
      ...prev,
      [errorProduct]: {
        IdArticulo: product.IdArticulo,
        CodigoBarras: errorProduct,
        Cantidad: (prev[errorProduct]?.Cantidad || 0) + 1,
      },
    }));

    setIsDialogOpen(false);
    setErrorProduct(null);
  };

  const getProgress = (code, requiredQuantity) => {
    const scannedQuantity = scannedItems[code]?.Cantidad || 0;
    return (scannedQuantity / requiredQuantity) * 100;
  };

  const finalizePedido = async () => {
    // Configura loading en true antes de iniciar el proceso de finalizar
    setLoading(true);

    const data = {
      Tienda: tienda,
      Almacen: "WEB",
      Items: Object.values(scannedItems), // Convierte el objeto en un array de items
    };

    try {
      const response = await fetch("/api/lux/envios/guardarenvio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      console.log(result);

      // Procesa la respuesta aquí si es necesario
    } catch (error) {
      console.error("Error:", error);
    } finally {
      // Finaliza el proceso configurando loading en false después del envío
      setLoading(false);
    }

    console.log("Pedido finalizado:", scannedItems);
    setScannedItems({});
  };

  // Filtrar productos según el rubro seleccionado
  const filteredProducts = selectedRubro
    ? products.filter((product) => product.Rubro === selectedRubro)
    : products;

  const handleRubroChange = (event) => {
    setSelectedRubro(event.target.value);
  };

if (loading) {
  return <Loading />;
}

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="sticky top-1 z-10">
        <Card className="max-w-4xl mx-auto border-none">
          <CardHeader className="p-3">
            <CardTitle className="text-2xl font-bold">
              Preparación de Pedidos
            </CardTitle>
            <form onSubmit={handleScan} className="flex gap-2 mb-4">
              <div className="relative flex-grow">
                <Barcode className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Escanea el código de barras"
                  value={barcode}
                  onChange={(e) => setBarcode(e.target.value)}
                  className="pl-10"
                  ref={inputRef}
                />
              </div>
            </form>
            {/* Selección de rubro */}
            <select
              className="mt-4 p-2 border rounded-lg"
              value={selectedRubro}
              onChange={handleRubroChange}
            >
              <option value="">Todos los Rubros</option>
              {[...new Set(products.map((p) => p.Rubro))].map((rubro) => (
                <option key={rubro} value={rubro}>
                  {rubro}
                </option>
              ))}
            </select>
          </CardHeader>
        </Card>
      </div>
      <Card className="max-w-4xl mx-auto mt-4">
        <CardContent className="p-2">
          <div className="space-y-4">
            {filteredProducts.map((product) => {
              // Cambia products a filteredProducts
              const scannedQuantity =
                scannedItems[product.CodigoBarras]?.Cantidad || 0;
              const progress = getProgress(product.CodigoBarras, product.Saldo);
              const isComplete = scannedQuantity >= product.Saldo;

              return (
                <div
                  key={product.IdArticulo}
                  ref={(el) => (productRefs.current[product.CodigoBarras] = el)}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-lg font-semibold">
                        {product.Cabecera}
                      </h3>
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-gray-500">Detalles: </p>
                        <Badge variant="secondary">
                          T.{product.DescripMedida}
                        </Badge>
                        <Badge variant="secondary">
                          {product.DescripDetalle}
                        </Badge>
                      </div>
                    </div>
                    {isComplete ? (
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-500" />
                    )}
                  </div>
                  <Progress value={progress} className="mb-2" />
                  <div className="flex justify-between text-sm">
                    <span>Escaneado: {scannedQuantity}</span>
                    <span>Requerido: {product.Saldo}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end p-2 pb-4">
          <Button
            onClick={finalizePedido}
            disabled={scannedItems.length <= 1}
          >
            <PackageCheck className="mr-2 h-4 w-4" />
            Finalizar Pedido
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Producto no válido o ya completado
            </AlertDialogTitle>
            <AlertDialogDescription>
              El producto escaneado no es válido o ya se ha completado la
              cantidad requerida. Puedes eliminar una unidad escaneando
              nuevamente el código o agregar el producto de todas formas.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              const dialogBarcode = dialogInputRef.current?.value || "";
              if (dialogBarcode === errorProduct) {
                handleRescanToRemove(dialogBarcode); // Elimina solo si el código coincide
              }
            }}
            className="flex gap-2 mt-4"
          >
            <Input
              type="text"
              placeholder="Escanea el código de barras para eliminar"
              ref={dialogInputRef}
              className="flex-grow"
            />
            <Button type="submit">Confirmar</Button>
          </form>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleForceAdd}>
              Agregar de todas formas
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
