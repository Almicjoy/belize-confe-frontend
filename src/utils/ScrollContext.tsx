// utils/ScrollContext.tsx
"use client";

import React, { createContext, useContext, useRef } from "react";

type ScrollRefs = {
  plansRef: React.RefObject<HTMLElement | null>;
  accommodationRef: React.RefObject<HTMLElement | null>;
  sponsorsRef: React.RefObject<HTMLElement | null>;
  preconfeRef: React.RefObject<HTMLElement | null>;
};

const ScrollContext = createContext<ScrollRefs | null>(null);

export const ScrollProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const plansRef = useRef<HTMLElement | null>(null);
  const accommodationRef = useRef<HTMLElement | null>(null);
  const sponsorsRef = useRef<HTMLElement | null>(null);
  const preconfeRef = useRef<HTMLElement | null>(null);

  return (
    <ScrollContext.Provider value={{ plansRef, accommodationRef, sponsorsRef, preconfeRef }}>
      {children}
    </ScrollContext.Provider>
  );
};

export const useScrollRefs = () => {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollRefs must be used inside ScrollProvider");
  return ctx;
};
