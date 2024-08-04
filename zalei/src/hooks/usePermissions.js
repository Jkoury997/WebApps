// hooks/usePermissions.js

import { userPermissions } from '@/utils/userPermissionsUtils';
import { useState, useEffect } from 'react';

async function fetchPermissions() {
; // Reemplaza esta URL con la URL de tu API
  const data = await userPermissions() ;
  return data;
}

export function usePermissions() {
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPermissions()
      .then((data) => {
        setPermissions(data.Menu);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  return { permissions, loading, error };
}
