import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select"; // Asegúrate de que exista un componente de Select o utiliza un select HTML

export function EnterGalpon({ Galpon, setGalpon, apiResponse }) {
  const handleChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setGalpon(value);
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
        <Label htmlFor="Galpon">Número de Galpón</Label>
        <select
          id="Galpon"
          value={Galpon}
          onChange={handleChange}
          className="border rounded px-3 py-2"
        >
          <option value="" disabled>Seleccionar número de galpón</option>
          {[...Array(9).keys()].map((i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
