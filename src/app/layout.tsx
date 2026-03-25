import type { Metadata } from "next";
import { Epilogue, Manrope } from "next/font/google";
import { Shell } from "@/components/shell";
import "./globals.css";

const epilogue = Epilogue({
  subsets: ["latin"],
  variable: "--font-epilogue",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ShowUp",
  description: "Real matches. Show up or miss out. The anti-swipe dating experience.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${epilogue.variable} ${manrope.variable}`}>
      <body>
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
