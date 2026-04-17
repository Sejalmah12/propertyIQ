import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "PropLocal — Hyperlocal Property Platform",
  description:
    "Buy or sell property within 20-30 km of your area. Find plots, houses, and flats near you with AI-powered price predictions.",
  keywords: "property, buy, sell, land, house, flat, plot, India, local, pincode",
  openGraph: {
    title: "PropLocal — Find Properties Near You",
    description: "Hyperlocal property platform for buyers and sellers across India.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="bg-slate-950 text-white antialiased">
        <Providers>
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
