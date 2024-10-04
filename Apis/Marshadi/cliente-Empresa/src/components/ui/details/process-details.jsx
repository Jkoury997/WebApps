import { CogIcon} from 'lucide-react';
import React from 'react';

export function ProcessDetails({ dataProcess }) {
  const process = dataProcess;

  if (!process) return null;

  return (
    <div className="p-3 border rounded-lg bg-gray-50 text-center flex flex-col items-center justify-center">
      <CogIcon className="h-10 w-10 mb-2" />
      {process.Descripcion && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium"></span>{process.Descripcion}
        </p>
      )}
      {process.CodProceso && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium"></span>{process.CodProceso}
        </p>
      )}
    </div>
  );
}
