import * as React from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/theme';

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          {props.children}
        </ThemeProvider>
      </body>
    </html>
  );
}