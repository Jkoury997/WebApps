import React from "react";
import { ArrowRightIcon, WarehouseIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card"; // Verifica que la ruta sea correcta

export default function DepositoInfo ({ depositoOrigen, depositoFinal }) {
  return (
<Card className="w-full max-w-md border-none shadow-none mx-auto">
  <CardContent className="p-2">
    <div className="flex items-center justify-between">
      <div className="flex flex-col items-center">
        <WarehouseIcon className="h-12 w-12 text-primary mb-2" />
        <span className="text-sm font-medium">{depositoOrigen?.Codigo || "Depósito 1"}</span>
        <span className="text-xs text-muted-foreground">{depositoOrigen?.Descripcion || "Código 1"}</span>
      </div>
      <ArrowRightIcon className="h-8 w-8 text-muted-foreground mx-4" />
      <div className="flex flex-col items-center">
        <WarehouseIcon className="h-12 w-12 text-primary mb-2" />
        <span className="text-sm font-medium">{depositoFinal?.Codigo || "..."}</span>
        <span className="text-xs text-muted-foreground">{depositoFinal?.Descripcion || "..."}</span>
      </div>
    </div>
  </CardContent>
</Card>
  );
};

