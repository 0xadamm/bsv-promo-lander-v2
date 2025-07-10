import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title:
    "Blue Scorpion - Revolutionary Pain & Inflammation Relief | End Your Pain",
  description:
    "End your pain with Blue Scorpion's scientifically proven anti-inflammatory technology. Feel relief in just hours with our revolutionary pain management system. Trusted by thousands worldwide.",
  keywords: [
    "pain relief",
    "inflammation relief",
    "Blue Scorpion",
    "anti-inflammatory",
    "chronic pain",
    "pain management",
  ],
  authors: [{ name: "Blue Scorpion" }],
  creator: "Blue Scorpion",
  publisher: "Blue Scorpion",
  formatDetection: {
    telephone: false,
  },
  metadataBase: new URL("https://bluescorpion.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Blue Scorpion - Revolutionary Pain & Inflammation Relief",
    description:
      "End your pain with scientifically proven anti-inflammatory technology. Feel relief in just hours.",
    url: "https://bluescorpion.com",
    siteName: "Blue Scorpion",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Blue Scorpion Pain Relief Formula",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Blue Scorpion - Revolutionary Pain & Inflammation Relief",
    description:
      "End your pain with scientifically proven anti-inflammatory technology. Feel relief in just hours.",
    images: ["/images/twitter-image.jpg"],
    creator: "@bluescorpion",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <meta name="theme-color" content="#1a1a2e" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Blue Scorpion",
              url: "https://bluescorpion.com",
              logo: "https://bluescorpion.com/images/logo.png",
              description:
                "Revolutionary pain & inflammation relief with scientifically proven anti-inflammatory technology",
              sameAs: [
                "https://instagram.com/bluescorpion",
                "https://facebook.com/bluescorpion",
                "https://twitter.com/bluescorpion",
              ],
              contactPoint: {
                "@type": "ContactPoint",
                telephone: "+1-555-123-4567",
                contactType: "customer service",
                email: "hello@bluescorpion.com",
              },
              address: {
                "@type": "PostalAddress",
                streetAddress: "123 Wellness Drive",
                addressLocality: "Los Angeles",
                addressRegion: "CA",
                postalCode: "90210",
                addressCountry: "US",
              },
            }),
          }}
        />

        {/* Product Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Product",
              name: "Blue Scorpion Pain Relief Formula",
              description:
                "Revolutionary pain relief formula with anti-inflammatory technology",
              brand: {
                "@type": "Brand",
                name: "Blue Scorpion",
              },
              aggregateRating: {
                "@type": "AggregateRating",
                ratingValue: "4.9",
                reviewCount: "1247",
                bestRating: "5",
                worstRating: "1",
              },
              offers: {
                "@type": "Offer",
                priceCurrency: "USD",
                price: "89.99",
                availability: "https://schema.org/InStock",
                url: "https://bluescorpion.com/products/pain-relief-formula",
              },
            }),
          }}
        />

        {/* Preload critical fonts */}
        <link
          rel="preload"
          href="/fonts/inter-var.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${inter.variable} antialiased font-sans`}
      >
        {children}
      </body>
    </html>
  );
}
