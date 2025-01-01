'use client';

import { useEffect } from 'react';
import { usePathname,} from 'next/navigation';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;


export function GoogleAnalytics({searchParams}) {
  const pathname = usePathname();

  useEffect(() => {
    const url = `${pathname}${searchParams ? '?' + searchParams.toString() : ''}`;
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
    }
  }, [pathname, searchParams]);

  return (
    <>
      {/* Agrega el script de gtag.js */}
      <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}></script>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `,
        }}
      />
    </>
  );
}
