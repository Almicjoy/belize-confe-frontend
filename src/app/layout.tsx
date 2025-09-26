"use client";

import "./globals.css";
import React, { useRef } from "react";
import Navbar from "@/components/Navbar";
import { useTranslation } from "@/utils/useTranslation";
import SessionWrapper from "./[locale]/SessionWrapper";
import { ScrollProvider, useScrollRefs } from "@/utils/ScrollContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const headerRef = useRef<HTMLElement>(null);
  const { t, locale } = useTranslation();

  const getHeaderHeight = () => headerRef.current?.offsetHeight || 0;

  const ScrollNav = () => {
    const { plansRef, accommodationRef, sponsorsRef, preconfeRef } = useScrollRefs();

    const scrollTo = (ref: React.RefObject<HTMLElement | null>) => {
      if (ref.current) {
        window.scrollTo({
          top: ref.current.offsetTop - getHeaderHeight(),
          behavior: "smooth",
        });
      }
    };

    return (
      <Navbar
        locale={locale}
        headerRef={headerRef}
        scrollToTop={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        scrollToPlans={() => scrollTo(plansRef)}
        scrollToAccommodations={() => scrollTo(accommodationRef)}
        scrollToSponsors={() => scrollTo(sponsorsRef)}
        scrollToPreconfe={() => scrollTo(preconfeRef)}
      />
    );
  };

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });


  return (
    <html lang="en">
      <body>
        <SessionWrapper>
          <ScrollProvider>
            <ScrollNav />
            <main>
              {children}
              <div id="modal-root"></div>
            </main>
          </ScrollProvider>
        </SessionWrapper>
      </body>
    </html>
  );
}
