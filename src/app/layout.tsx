import Link from "next/link";
import "./globals.css";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        
        <nav className="p-4 bg-gray-200">
          <Link href="/" className="mr-4">Home</Link>
        </nav>
        <main className="">{children}
          <div id="modal-root"></div>
        </main>
      </body>
    </html>
  );
}
