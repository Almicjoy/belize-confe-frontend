

// app/[locale]/layout.tsx
import type { ReactNode } from "react";
import SessionWrapper from "./SessionWrapper";
import "../globals.css";

interface LocaleLayoutProps {
  children: ReactNode;
  params: Promise<{ locale: string }>; // Changed to Promise
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params; // Await the params

  return (
    <html lang={locale}>
      <body>
        <main>
          {/* <SessionWrapper>{children}</SessionWrapper> */}
          {children}
          <div id="modal-root"></div>
        </main>
      </body>
    </html>
  );
}