
import React from 'react';

export function PlanDetails({dataPlan}) {
    const plan = dataPlan;

    if (!plan) return null;
  
  return (
    <div className="p-3 border rounded-lg bg-gray-50 text-center flex flex-col items-center justify-center">
              {plan.NumeroPlan
 && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">N° Plan: </span>{plan.NumeroPlan
          }
        </p>
      )}
      {plan.DescArticulo && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Descripcion: </span>{plan.DescArticulo}
        </p>
      )}
    </div>
  );
}
