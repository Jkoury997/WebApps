import { useState, useEffect } from 'react';
import { userPermissions } from '@/utils/userPermissionsUtils';

async function fetchPermissions() {
  try {
    const data = await userPermissions(); 
    return data;
  } catch (error) {
    throw new Error('Failed to fetch permissions');
  }
}

export function usePermissions() {
  const [permissions, setPermissions] = useState([]); // Inicializar con un array vacío
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true; // Flag para comprobar si el componente está montado

    fetchPermissions()
      .then((data) => {
        if (isMounted) {
          setPermissions(Array.isArray(data.Menu) ? data.Menu : []); // Asegurarse de que `Menu` sea un array
          setLoading(false);
        }
      })
      .catch((error) => {
        if (isMounted) {
          setError(error.message);
          setLoading(false);
        }
      });

    // Cleanup para evitar actualizaciones de estado en un componente desmontado
    return () => {
      isMounted = false;
    };
  }, []);

  return { permissions, loading, error };
}
