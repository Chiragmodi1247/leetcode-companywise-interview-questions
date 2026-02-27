"use client";

import { ThemeProvider, createTheme, CssBaseline } from "@mui/material";
import { useMemo } from "react";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: "#1976d2" },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), Arial, sans-serif",
  },
  shape: { borderRadius: 8 },
});

export default function ThemeRegistry({ children }: { children: React.ReactNode }) {
  const t = useMemo(() => theme, []);
  return (
    <ThemeProvider theme={t}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
