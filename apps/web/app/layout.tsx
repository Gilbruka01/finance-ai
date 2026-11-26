import type { ReactNode } from "react";
import "./globals.css";

export { metadata } from "./metadata";

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
