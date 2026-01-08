import type { Metadata } from "next";
import { Orbitron } from "next/font/google";
import { Providers } from "@/components/providers";
import "@/styles/globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KonnectTech || Amazing customized Tech Shopping Experience",
  description: "KonnectTech offers an amazing, customized tech shopping experience, helping you discover and shop for the best gadgets tailored to your needs.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${orbitron.variable} antialiased`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
