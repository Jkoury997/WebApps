"use client";

import { useSearchParams } from "next/navigation";
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

export const dynamic = "force-dynamic";

export default function Component() {
  const searchParams = useSearchParams();

  const [tienda,setTienda] = useState("");
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


  useEffect(() => {
    const tiendaParam = searchParams.get("tienda");
    if (tiendaParam && tiendaParam !== tienda) {
      setTienda(tiendaParam);
    }
  }, [searchParams]);

  const fetchTienda = async (tienda) => {
    try {
      const response = await fetch(
        `/api/lux/envios/consultarenvio?tienda=${tienda}`
      );
      const data = await response.json();

      const filteredProducts = Array.isArray(data.Articulos)
        ? data.Articulos.filter((product) => product.Stock > 0).map((product) => ({
            ...product,
            Saldo: Math.abs(product.Saldo || 0),
          }))
        : [];

      setProducts(filteredProducts);
    } catch (error) {
      console.error("Error al obtener productos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (tienda) fetchTienda(tienda);
  }, [tienda]);

  useEffect(() => {
    if (inputRef.current) inputRef.current.focus();
  }, [barcode, scannedItems, isDialogOpen]);

  const handleScan = (e) => {
    e.preventDefault();
    if (barcode.trim()) processScan(barcode);
    setBarcode("");
  };

  const processScan = (code) => {
    const product = products.find((p) => p.CodigoBarras === code);
    if (product) {
      const scannedQuantity = scannedItems[code]?.Cantidad || 0;
      if (scannedQuantity >= product.Saldo) {
        setErrorProduct(code);
        setIsDialogOpen(true);
      } else {
        setScannedItems((prev) => ({
          ...prev,
          [code]: {
            IdArticulo: product.IdArticulo,
            CodigoBarras: code,
            Cantidad: scannedQuantity + 1,
          },
        }));

        productRefs.current[code]?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    } else {
      setErrorProduct(code);
      setIsDialogOpen(true);
    }
  };

  const handleForceAdd = () => {
    const product = products.find((p) => p.CodigoBarras === errorProduct);
    if (product) {
      setScannedItems((prev) => ({
        ...prev,
        [errorProduct]: {
          IdArticulo: product.IdArticulo,
          CodigoBarras: errorProduct,
          Cantidad: (prev[errorProduct]?.Cantidad || 0) + 1,
        },
      }));
    }
    setIsDialogOpen(false);
    setErrorProduct(null);
  };

  const finalizePedido = async () => {
    setLoading(true);

    const data = {
      Tienda: tienda,
      Almacen: "WEB",
      Items: Object.values(scannedItems),
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
      console.log("Pedido guardado:", result);

      setScannedItems({});
    } catch (error) {
      console.error("Error al guardar pedido:", error);
    } finally {
      setLoading(false);
    }
  };

  const getProgress = (code, requiredQuantity) => {
    const scannedQuantity = scannedItems[code]?.Cantidad || 0;
    return Math.min((scannedQuantity / requiredQuantity) * 100, 100);
  };

  const filteredProducts = selectedRubro
    ? products.filter((product) => product.Rubro === selectedRubro)
    : products;

  const handleRubroChange = (event) => setSelectedRubro(event.target.value);

  return loading ? (
    <Loading />
  ) : (
    <div className="min-h-screen bg-gray-100">
      <Card className="max-w-4xl mx-auto border-none">
        <CardHeader className="p-3">
          <CardTitle className="text-2xl font-bold">Preparación de Pedidos</CardTitle>
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

      <Card className="max-w-4xl mx-auto mt-4">
        <CardContent>
          {filteredProducts.map((product) => {
            const scannedQuantity = scannedItems[product.CodigoBarras]?.Cantidad || 0;
            const progress = getProgress(product.CodigoBarras, product.Saldo);
            const isComplete = scannedQuantity >= product.Saldo;

            return (
              <div
                key={product.IdArticulo}
                ref={(el) => (productRefs.current[product.CodigoBarras] = el)}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-semibold">{product.Cabecera}</h3>
                  {isComplete ? (
                    <CheckCircle2 className="h-6 w-6 text-green-500" />
                  ) : (
                    <XCircle className="h-6 w-6 text-red-500" />
                  )}
                </div>
                <Progress value={progress} />
                <div className="flex justify-between text-sm">
                  <span>Escaneado: {scannedQuantity}</span>
                  <span>Requerido: {product.Saldo}</span>
                </div>
              </div>
            );
          })}
        </CardContent>

        <CardFooter>
          <Button
            onClick={finalizePedido}
            disabled={Object.keys(scannedItems).length === 0}
          >
            <PackageCheck className="mr-2 h-4 w-4" />
            Finalizar Pedido
          </Button>
        </CardFooter>
      </Card>

      <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Producto no válido o ya completado</AlertDialogTitle>
            <AlertDialogDescription>
              El producto escaneado no es válido o ya se completó la cantidad requerida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={handleForceAdd}>Agregar de todas formas</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
