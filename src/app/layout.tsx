import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { NextAuthProvider } from "@/components/providers/session-provider";

const inter = Inter({ subsets: ["latin"] });

const APP_URL = process.env.AUTH_URL || "https://portal.studentconsultancy.com";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Student Consultancy Portal | Yurtdışı Eğitim Danışmanlığı",
    template: "%s | Student Consultancy Portal"
  },
  description: "Yurtdışı eğitim hayallerinizi gerçeğe dönüştürün. Üniversite başvuruları, vize süreçleri ve daha fazlası için profesyonel danışmanlık platformu.",
  keywords: ["yurtdışı eğitim", "üniversite başvurusu", "eğitim danışmanlığı", "vize danışmanlığı", "yurtdışı üniversite", "student consultancy"],
  authors: [{ name: "Student Consultancy Team" }],
  creator: "Student Consultancy",
  publisher: "Student Consultancy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    title: "Student Consultancy Portal",
    description: "Yurtdışı eğitim yolculuğunuzu tek bir yerden yönetin.",
    url: APP_URL,
    siteName: "Student Consultancy Portal",
    locale: "tr_TR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Consultancy Portal",
    description: "Yurtdışı eğitim hayalleriniz için profesyonel çözüm ortağınız.",
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Student Consultancy",
    "url": APP_URL,
    "logo": `${APP_URL}/logo1.png`,
    "sameAs": [
      "https://www.instagram.com/studentconsultancy",
      "https://www.linkedin.com/company/studentconsultancy"
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+90-537-305-6266",
      "contactType": "customer service",
      "areaServed": "TR",
      "availableLanguage": "Turkish"
    }
  };

  return (
    <html lang="tr">
      <body className={inter.className}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextAuthProvider>
          {children}
          <Toaster position="bottom-center" />
        </NextAuthProvider>
      </body>
    </html>
  );
}
