import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";

export default function TableResumen({ data }) {
  return (
    // Tarjetas de resumen
    <Card className="x-chunk dashboard-01-chunk-4">
      <CardHeader className="flex flex-row items-center">
        <div className="grid gap-2">
          <CardTitle>Más Variables</CardTitle>
          <CardDescription>Otras variables.</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="p-3">
        <Table>
          <TableHeader>
          <TableRow>
  <TableHead>Variables</TableHead>
  <TableHead>Monto</TableHead>

  {/* Conditionally render the 'Comparación' header if applicable */}
  {data && data[0] && data[0].variacion && data[0].variacion !== "N/A" ? (
    <TableHead>Comparación</TableHead>
  ) : null}
</TableRow>

          </TableHeader>
          <TableBody>
            {data.map((row, index) => {
              // Determinar las clases de estilo basadas en row.percentage
              const badgeStyles =
                row.variacion > 0
                  ? "bg-green-100 text-green-800 px-2 py-1 rounded-full"
                  : "bg-red-100 text-red-800 px-2 py-1 rounded-full";

              return (
                <TableRow key={row.variable} className="text-start">
                  <TableCell>{row.variable}</TableCell>
                  <TableCell>{row.monto}</TableCell>

                {/* Renderizar el badge con las clases correspondientes */}
                {row.variacion && row.variacion !== "N/A" ? (
                  <TableCell>
                  <span className={`text-xs ${badgeStyles}`}>{row.variacion}%</span>
                </TableCell>
                ) : null}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
