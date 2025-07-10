import type { Metadata } from "next";
import "./globals.css";
import Navbar from "./components/main/Navbar";
import { Kanit } from 'next/font/google'

const kanit = Kanit({
  subsets: ['latin'],
  weight: ['400', '700'],        // you can include other weights
  variable: '--font-kanit',      // optional if you want to use CSS variable
  display: 'swap',               // improves performance
})

export const metadata: Metadata = {
  title: "Teams splits",
  description: "make Teams easy!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={kanit.className}
      >
        <div className="max-w-lg mx-auto">
          <Navbar />
          {children}
        </div>

      </body>
    </html>
  );
}
