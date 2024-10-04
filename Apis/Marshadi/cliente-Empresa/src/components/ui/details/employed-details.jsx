import { UserIcon } from 'lucide-react';
import React from 'react';

export function EmployeDetails({ dataEmploye }) {
  const Employe = dataEmploye;

  if (!Employe || !Employe.Persona) return null;

  return (
    <div className="p-3 border rounded-lg bg-gray-50 text-center flex flex-col items-center justify-center">
      <UserIcon className="h-10 w-10 mb-2" />
      {Employe.Persona.Nombre && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium"></span>{Employe.Persona.Nombre}
        </p>
      )}
      {Employe.Persona.CodPersona && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium"></span>{Employe.Persona.CodPersona}
        </p>
      )}
    </div>
  );
}
