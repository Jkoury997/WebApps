import { usePathname, useSearchParams } from 'next/navigation';
import { useMemo } from 'react';

export function useCurrentUrl() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const queryString = searchParams.toString();
    return `${window.location.origin}${pathname}${queryString ? `?${queryString}` : ''}`;
  }, [pathname, searchParams]);

  return currentUrl;
}
