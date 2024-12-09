'use client';
import React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/theme';
import Header from '@/components/header';
import { usePathname } from 'next/navigation';

export default function RootLayout(props: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if the pathname starts with /admin
  const shouldShowHeader = !pathname.startsWith('/admin');

  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {shouldShowHeader && <Header />}
          {props.children}
        </ThemeProvider>
      </body>
    </html>
  );
}
