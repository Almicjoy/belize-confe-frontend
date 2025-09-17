// app/[locale]/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";
import SessionWrapper from "./SessionWrapper"; // This should work now
import "../globals.css";

export default function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;
  return (
    <html lang={locale}>
      <body>
        <main>
          <SessionWrapper>{children}</SessionWrapper>
          <div id="modal-root"></div>
        </main>
      </body>
    </html>
  );
}
