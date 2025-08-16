import type { Metadata } from "next";
import "./globals.css";
import VisualEditsMessenger from "../visual-edits/VisualEditsMessenger";
import ErrorReporter from "@/components/ErrorReporter";
import { Header } from "@/components/header";
import Script from "next/script";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "TrendifyMart - Premium Polo Shirts & T-shirts",
  description: "Discover TrendifyMart's premium collection of polo shirts and t-shirts. Experience ultimate comfort with our smart tech polos and classic designs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <ErrorReporter />
        <Script
          src="https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/scripts//route-messenger.js"
          strategy="afterInteractive"
          data-target-origin="*"
          data-message-type="ROUTE_CHANGE"
          data-include-search-params="true"
          data-only-in-iframe="true"
          data-debug="true"
          data-custom-data='{"appName": "YourApp", "version": "1.0.0", "greeting": "hi"}'
        />
        <Header />
        {children}
        <Toaster 
          position="top-right"
          richColors
          closeButton
        />
        <VisualEditsMessenger />
      </body>
    </html>
  );
}