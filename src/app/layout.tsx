
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import CartProviderWrapper from "@/components/CartProviderWrapper";
import { AuthProvider } from "@/context/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});


export const metadata: Metadata = {
  metadataBase: new URL("https://tech-o-mech.vercel.app"),
  title: "Tech O Mech | Gaming PCs & Accessories",
  description:
    "Explore gaming PCs, monitors, keyboards, mice, headsets, and gaming accessories at Tech O Mech.",
  openGraph: {
    title: "Tech O Mech | Gaming PCs & Accessories",
    description:
      "Explore gaming PCs, monitors, keyboards, mice, headsets, and gaming accessories at Tech O Mech.",
    url: "https://tech-o-mech.vercel.app",
    siteName: "Tech O Mech",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Tech O Mech - Gaming PCs and Accessories",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech O Mech | Gaming PCs & Accessories",
    description:
      "Explore gaming PCs, monitors, keyboards, mice, headsets, and gaming accessories at Tech O Mech.",
    images: ["/opengraph-image.png"],
  },
};


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
        <AuthProvider>
          <CartProviderWrapper>
            <Header />
            {children}
            <Footer />
          </CartProviderWrapper>
        </AuthProvider>
      </body>
    </html>
  );
}
