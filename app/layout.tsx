import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ColorSchemeScript, MantineProvider, mantineHtmlProps } from "@mantine/core";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { EstimateRequestModal } from "@/components/EstimateRequestModal";
import { LocalBusinessJsonLd } from "@/components/LocalBusinessJsonLd";
import { SITE_NAME, SITE_URL, s3Image } from "@/lib/site";
import { theme } from "@/lib/theme";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} | Painting Services in Summit & Wasatch Counties`,
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Professional interior and exterior painting, staining, and wood refinishing in Park City, Summit & Wasatch County since 1987. Free estimates and quality craftsmanship.",
  metadataBase: new URL(SITE_URL),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: SITE_NAME,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: s3Image("images/companyFavicon.ico"),
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" {...mantineHtmlProps}>
      <head>
        <ColorSchemeScript defaultColorScheme="light" />
        <LocalBusinessJsonLd />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen antialiased`}
        suppressHydrationWarning
      >
        <MantineProvider theme={theme} defaultColorScheme="light">
          <Header />
          <main className="min-h-[60vh]">{children}</main>
          <Footer />
          <EstimateRequestModal />
        </MantineProvider>
      </body>
    </html>
  );
}
