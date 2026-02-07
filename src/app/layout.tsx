import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Cinzel, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cinzel = Cinzel({
  variable: "--font-cinzel",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Forboc Studio | Arcane AI Workbench",
  description: "God Mode for the Forboc SDK",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <Script src="https://www.googletagmanager.com/gtag/js?id=G-3VXNF0K2D1" strategy="afterInteractive" />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-3VXNF0K2D1');`}
      </Script>
      <body
        className={`${inter.variable} ${cinzel.variable} ${jetbrainsMono.variable} antialiased font-sans bg-background text-foreground`}
      >
        {children}
      </body>
    </html>
  );
}
