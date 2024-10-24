"use client"


import localFont from "next/font/local";
import "./globals.css";
import { GlobalStateProvider } from "./contexts/global-state";
import GlobalLoadingIndicator from "@/components/ui/Loading";
import { Toaster } from "@/components/ui/toaster";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <GlobalStateProvider>
          <GlobalLoadingIndicator></GlobalLoadingIndicator>
        {children}
        <Toaster />
        </GlobalStateProvider>
      </body>
    </html>
  );
}
