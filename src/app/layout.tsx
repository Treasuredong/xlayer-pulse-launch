import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@/app/globals.css";
import { AppProviders } from "@/components/app-providers";

export const metadata: Metadata = {
  title: "Pulse Launch",
  description: "A pulse-driven fair launch control room built on X Layer and Uniswap v4 hooks."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="zh-CN">
      <body>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
