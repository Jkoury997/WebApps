import {
    CreditCardIcon,
    BanknoteIcon,
    DollarSignIcon,
    CreditCard,
  } from "lucide-react";

  import { Card,CardHeader,CardTitle,CardContent } from "@/components/ui/card";

  export default function CardResumen({ data }) {
    return (
      // Tarjetas de resumen
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.map((item) => {
          const IconComponent = item.icon;
          // Determinar las clases de estilo
          const badgeStyles =
            item.percentage > 0
              ? 'bg-green-100 text-green-800 px-2 py-1 rounded-full'
              : 'bg-red-100 text-red-800 px-2 py-1 rounded-full' ;
  
          return (
            <Card key={item.id} x-chunk={item.id}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{item.title}</CardTitle>
                {IconComponent && (
                  <IconComponent className="h-4 w-4 text-muted-foreground" />
                )}
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{item.value}</div>
                {/* Renderizar el badge con las clases correspondientes */}
                {item.percentage && item.percentage !== "N/A" ? (
                  <p>
                    <span className={`text-xs ${badgeStyles}`}>
                      {item.percentage}%
                    </span>
                  </p>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </div>
    );
  }
  