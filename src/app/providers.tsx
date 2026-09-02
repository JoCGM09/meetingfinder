'use client';

import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { APIProvider } from '@vis.gl/react-google-maps';
import { ReactNode } from 'react';

export function Providers({ children }: { children: ReactNode }) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '';

  return (
    <APIProvider apiKey={apiKey} libraries={['places', 'marker']}>
      <NextThemesProvider 
        attribute="class" 
        defaultTheme="system" 
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </NextThemesProvider>
    </APIProvider>
  );
}
