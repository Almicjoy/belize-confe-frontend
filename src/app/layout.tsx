import "./globals.css";
import React from "react";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        
        <nav className="p-4 bg-gray-200">
          <a href="/" className="mr-4">Home</a>
        </nav>
        <main className="">{children}
          <div id="modal-root"></div>
        </main>
      </body>
    </html>
  );
}
