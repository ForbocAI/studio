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
  metadataBase: new URL("https://studio.forboc.ai"),
  title: "Forboc Studio | Arcane AI Workbench",
  description: "God Mode for the Forboc SDK. Monitor, edit, and orchestrate architected agents in real-time.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Forboc Studio | Arcane AI Workbench",
    description: "God Mode for the Forboc SDK.",
    url: "https://studio.forboc.ai",
    siteName: "Forboc Studio",
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Forboc Studio | Arcane AI Workbench",
    description: "God Mode for the Forboc SDK.",
    images: ["/logo.png"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": "https://forboc.ai/#organization",
      "name": "ForbocAI",
      "url": "https://forboc.ai",
      "logo": "https://forboc.ai/logo.png"
    },
    {
      "@type": "SoftwareApplication",
      "name": "Forboc Studio",
      "operatingSystem": "Web",
      "applicationCategory": "DeveloperApplication",
      "description": "Orchestration workbench for Forboc AI agents.",
      "url": "https://studio.forboc.ai",
      "publisher": {
        "@id": "https://forboc.ai/#organization"
      }
    }
  ]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" style={{ colorScheme: "dark" }}>
      <head>
        <meta name="theme-color" content="#131313" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
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
