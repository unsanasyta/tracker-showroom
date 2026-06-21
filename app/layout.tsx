"use client";

import "./globals.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <title>Financial Trackers – Amanah Mobilindo</title>

        <link rel="preconnect" href="https://fonts.googleapis.com" />

        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />

        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>

      <body
        style={{
          margin: 0,
          background: "#F5F6FA",
          fontFamily: "'DM Sans', sans-serif",
          fontSize: "14px",
          color: "#1B263B",
          overflowX: "hidden",
        }}
      >
        {children}
      </body>
    </html>
  );
}