import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { PanierProvider } from "@/lib/panier-context";
import VisitTracker from "@/components/VisitTracker";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://ledoudou.ci";
const seoTitle = "Le Doudou | Style, TheStyle et vêtements streetwear à Abidjan";
const seoDescription =
  "Le Doudou est une boutique de vêtements streetwear premium à Abidjan. Découvrez des pièces stylées, TheStyle, tenues tendance, pantalons, chemises et t-shirts avec commande via WhatsApp.";
const seoKeywords = [
  "Le Doudou",
  "Doudou",
  "style",
  "the style",
  "thestyle",
  "TheStyle",
  "vêtement",
  "vêtements",
  "vetement",
  "vetements",
  "vêtement à Abidjan",
  "vêtements à Abidjan",
  "vetement a Abidjan",
  "vetements a Abidjan",
  "boutique vêtement Abidjan",
  "boutique vetement Abidjan",
  "streetwear Abidjan",
  "mode Abidjan",
  "habit Abidjan",
  "t-shirt Abidjan",
  "pantalon Abidjan",
  "chemise Abidjan",
];

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: seoTitle,
    template: "%s | Le Doudou",
  },
  description: seoDescription,
  keywords: seoKeywords,
  applicationName: "Le Doudou",
  authors: [{ name: "Le Doudou" }],
  creator: "Le Doudou",
  publisher: "Le Doudou",
  category: "Mode streetwear",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "fr_CI",
    url: siteUrl,
    siteName: "Le Doudou",
    title: seoTitle,
    description: seoDescription,
    images: [
      {
        url: "/logo.png",
        width: 1200,
        height: 630,
        alt: "Le Doudou - boutique de vêtements streetwear à Abidjan",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: seoTitle,
    description: seoDescription,
    images: ["/logo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: "Le Doudou",
  alternateName: ["Doudou", "TheStyle", "The Style"],
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  image: `${siteUrl}/logo.png`,
  description: seoDescription,
  telephone: "+2250777697233",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Abidjan",
    addressCountry: "CI",
  },
  areaServed: ["Abidjan", "Côte d'Ivoire"],
  sameAs: [
    "https://www.instagram.com/the_style_1_?igsh=dzkzM2k3cjhqZ2s3&utm_source=qr",
    "https://www.tiktok.com/@thestyleg1?_r=1&_t=ZS-97Qx1wUAzbO",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
        <PanierProvider>
          <VisitTracker />
          <Navbar />
          <div className="flex-1">{children}</div>
          <Footer />
        </PanierProvider>
      </body>
    </html>
  );
}
