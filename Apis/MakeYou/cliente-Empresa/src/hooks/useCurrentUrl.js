import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useCurrentUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    const queryString = searchParams.toString();
    const url = `${pathname}${queryString ? `?${queryString}` : ''}`;
    setCurrentUrl(url);
  }, [pathname, searchParams]);

  return currentUrl;
}
