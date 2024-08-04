import { Label } from "@/components/ui/label";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function SelectWarehouse({ warehouse, setWarehouse}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="warehouse">Almacén</Label>
      <Select value={warehouse} onValueChange={(value) => setWarehouse(value)}>
        <SelectTrigger id="warehouse">
          <SelectValue placeholder="Selecciona un almacén" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="warehouse-a">Almacén A</SelectItem>
          <SelectItem value="warehouse-b">Almacén B</SelectItem>
          <SelectItem value="warehouse-c">Almacén C</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}