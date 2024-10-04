import { CogIcon, Settings2Icon} from 'lucide-react';
import React from 'react';

export function MachineDetails({ dataMaquina }) {
  const maquina = dataMaquina;

  if (!maquina) return null;

  return (
    <div className="p-3 border rounded-lg bg-gray-50 text-center flex flex-col items-center justify-center">
      {maquina.CodMaquina && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Maquina N° </span>{maquina.CodMaquina}
        </p>
      )}
      {maquina.Descripcion && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium"></span>{maquina.Descripcion}
        </p>
      )}
            {maquina.Tipo && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium"></span>{maquina.Tipo}
        </p>
      )}
    </div>
  );
}
