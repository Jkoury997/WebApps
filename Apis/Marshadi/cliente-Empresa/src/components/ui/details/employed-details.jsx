import React from 'react';

export function EmployeDetails({ dataEmploye}) {
  const Employe = dataEmploye;

  if (!Employe|| !Employe.Persona) return null;

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-lg font-semibold mb-2">Detalles del Personal</h3>
      {Employe.Persona.Nombre && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Nombre: </span>{Employe.Persona.Nombre}
        </p>
      )}
            {Employe.Persona.CodPersona && (
        <p className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">Codigo: </span>{Employe.Persona.CodPersona}
        </p>
      )}

    </div>
  );
}
