"use client";

import * as React from "react";

import { GoogleTranslateHost } from "@/components/layout/language-toggle";
import { ThemeProvider } from "@/components/providers/theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <GoogleTranslateHost />
      {children}
    </ThemeProvider>
  );
}
