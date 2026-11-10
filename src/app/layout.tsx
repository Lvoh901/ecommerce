import type { Metadata } from "next";
import { Montserrat, Orbitron } from "next/font/google";
import { Providers } from "@/components/providers";
import "@/styles/globals.css";

const orbitron = Orbitron({
  variable: "--font-orbitron",
  subsets: ["latin"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "KonnectTech || Amazing customized Tech Shopping Experience",
  description: "KonnectTech offers an amazing, customized tech shopping experience, helping you discover and shop for the best gadgets tailored to your needs.",
  icons: {
    icon: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${orbitron.variable}`}
    >
      <body className="antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
