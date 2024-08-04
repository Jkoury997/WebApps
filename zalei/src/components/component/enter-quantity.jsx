import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function EnterQuantity({ Cantidad, setCantidad, apiResponse }) {
  const handleChange = (e) => {
    let value = parseFloat(e.target.value);
    
    if (isNaN(value)) {
      setCantidad("");
      return;
    }

    if (value < 0) {
      value = 0;
    } else if (value > 30) {
      value = 30;
    }

    if (value % 0.5 !== 0) {
      value = Math.floor(value * 2) / 2;
    }

    setCantidad(value);
  };

  return (
    <div className="grid gap-4">
      {apiResponse && (
        <div className="p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-2">Detalles del Artículo</h3>
          {apiResponse.Articulo.DescDetalle && (
            <p className="text-sm text-muted-foreground mb-1">
              <span className="font-medium">Color: </span>{apiResponse.Articulo.DescDetalle}
            </p>
          )}
          {apiResponse.Articulo.DescMedida && (
            <p className="text-sm text-muted-foreground mb-1">
              <span className="font-medium">Medida: </span>{apiResponse.Articulo.DescMedida}
            </p>
          )}
          {apiResponse.Articulo.Descripcion && (
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Descripción: </span>{apiResponse.Articulo.Descripcion}
            </p>
          )}
        </div>
      )}
      <div className="grid gap-2">
        <Label htmlFor="Cantidad">Cantidad</Label>
        <Input
          id="Cantidad"
          type="number"
          step="0.5"
          placeholder="Ingresa la cantidad (múltiplos de 0.5)"
          value={Cantidad}
          onChange={handleChange}
          min="0"
          max="30"
        />
      </div>
    </div>
  );
}
