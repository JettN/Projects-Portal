import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "../styles/globals.css";
import Header from '../components/header';
import HKNChatbot from '../components/chatBot';
import Script from 'next/script';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HKN Projects Portal",
  description: "Eta Kappa Nu at UCSD — engineering projects, resources, and showcase",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
  src="https://identity.netlify.com/v1/netlify-identity-widget.js"
  strategy="beforeInteractive"
/>
        <Header />
        {children}
        <HKNChatbot />
      </body>
    </html>
  );
}
