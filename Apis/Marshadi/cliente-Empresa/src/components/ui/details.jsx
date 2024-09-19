import React from 'react';

export function Details({ details }) {

  if (!details || Object.keys(details).length === 0) return null;

  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h3 className="text-sm font-semibold mb-2">Detalles Dinámicos</h3>
      {Object.keys(details).map((key) => (
        <p key={key} className="text-sm text-muted-foreground mb-1">
          <span className="font-medium">{key}: </span>
          {details[key]}
        </p>
      ))}
    </div>
  );
}
