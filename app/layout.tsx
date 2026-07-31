import type { Metadata } from "next";
import { Titillium_Web } from "next/font/google";
import { SiteChrome } from "../components/SiteChrome";
import "./globals.css";

const titillium = Titillium_Web({
  variable: "--font-titillium",
  subsets: ["latin"],
  weight: ["300", "400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.BETTER_AUTH_URL ?? "http://localhost:3000",
  ),
  title: {
    default: "LOVE 21 Foundation",
    template: "%s - LOVE 21 Foundation",
  },
  description:
    "Love 21 Foundation empowers the Down syndrome, autistic and neurodiverse community in Hong Kong through sport, nutrition and holistic support programmes.",
  icons: {
    icon: "/assets/images/logo.png",
  },
  openGraph: {
    title: "LOVE 21 Foundation",
    description:
      "Empowering the Down syndrome, autistic and neurodiverse community in Hong Kong.",
    type: "website",
    images: [{ url: "/og.png", width: 1744, height: 909 }],
  },
  twitter: {
    card: "summary_large_image",
    images: ["/og.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={titillium.variable}>
        <div className="development-ribbon">
          Development copy — account data is stored in local SQLite
        </div>
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
