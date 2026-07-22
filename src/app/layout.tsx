import type { Metadata } from "next";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://defora.digital"),
  title: "Defora Digital",
  icons: {
    icon: "/favicon.ico",
  },
  description: "Defora tarafindan uretilen premium dijital deneyimler.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr" className="h-full antialiased">
      <body className="min-h-full bg-[#0D172B]">{children}</body>
      <GoogleAnalytics gaId="G-GVBT362HM1" />
    </html>
  );
}
