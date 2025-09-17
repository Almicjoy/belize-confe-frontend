// app/[locale]/layout.tsx
import type { ReactNode } from "react";
import SessionWrapper from "./SessionWrapper";
import "../globals.css";

interface LocaleLayoutProps {
  children: ReactNode;
  params: { locale: string };
}

export default function LocaleLayout({ children, params }: LocaleLayoutProps) {
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
