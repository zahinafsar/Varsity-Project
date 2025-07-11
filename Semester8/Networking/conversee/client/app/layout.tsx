import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { LogoutButton } from "./logout";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Conversee Chat",
  description: "Chat with your friends anonymously",
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
        <LogoutButton />
        <div className="flex flex-col items-center justify-center min-h-screen bg-blue-50">
          <div className="w-full max-w-[800px] bg-white/80 backdrop-blur-lg shadow-xl rounded-2xl p-6 m-4">
            {children}
          </div>
        </div>
      </body>
    </html>
  );
}
