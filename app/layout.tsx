import type { Metadata } from "next";
import "./globals.css";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { CartProvider } from "@/lib/cart-context";

export const metadata: Metadata = {
  metadataBase: new URL("https://peptigene.demo"),
  title: {
    default: "Peptigene · Suplementos deportivos formulados con estándares clínicos",
    template: "%s · Peptigene",
  },
  description:
    "Peptigene formula suplementos deportivos premium para personas activas: proteínas, creatina, pre-entrenos, recuperación y bienestar. Envíos a toda Colombia.",
  keywords: [
    "suplementos deportivos",
    "proteína whey",
    "creatina",
    "pre-entreno",
    "magnesio",
    "omega 3",
    "Peptigene",
    "nutrición deportiva Colombia",
  ],
  authors: [{ name: "Peptigene" }],
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://peptigene.demo",
    title: "Peptigene · Suplementos deportivos formulados con estándares clínicos",
    description:
      "Suplementos deportivos premium: proteínas, creatina, pre-entrenos, recuperación y bienestar.",
    siteName: "Peptigene",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peptigene · Suplementos deportivos",
    description: "Formulados con estándares clínicos para personas activas.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
      "max-image-preview": "large",
    },
  },
  alternates: {
    canonical: "/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es-CO">
      <head>
        {/* JSON-LD Organization schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Peptigene",
              url: "https://peptigene.demo",
              logo: "https://peptigene.demo/logo.svg",
              description:
                "Marca de suplementos deportivos formulados con estándares clínicos.",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Medellín",
                addressCountry: "CO",
              },
              sameAs: [],
            }),
          }}
        />
      </head>
      <body>
        <CartProvider>
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <WhatsAppButton />
        </CartProvider>
      </body>
    </html>
  );
}
