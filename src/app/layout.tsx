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

  // const scrollToConnect = () => {
  //   if (plansRef.current) {
  //     window.scrollTo({
  //       top: plansRef.current.offsetTop - getHeaderHeight(),
  //       behavior: "smooth",
  //     });
  //   }
  // };

  // const scrollToAccommodations = () => {
  //   if (accommodationRef.current) {
  //     window.scrollTo({
  //       top: accommodationRef.current.offsetTop - getHeaderHeight(),
  //       behavior: "smooth",
  //     });
  //   }
  // };

  // const scrollToSponsors = () => {
  //   if (sponsorsRef.current) {
  //     window.scrollTo({
  //       top: sponsorsRef.current.offsetTop - getHeaderHeight(),
  //       behavior: "smooth",
  //     });
  //   }
  // };

  // const scrollToPreconfe = () => {
  //   if (preconfeRef.current) {
  //     window.scrollTo({
  //       top: preconfeRef.current.offsetTop - getHeaderHeight(),
  //       behavior: "smooth",
  //     });
  //   }
  // };

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
