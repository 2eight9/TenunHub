
import type { Metadata } from "next"; 
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/navbar"; 

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
});

export const metadata: Metadata = {
  title: "TenunHub - Karyanya Tenun, Ceritanya Kita",
  description: "Melestarikan warisan budaya tenun melalui teknologi AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <body className="bg-[#FDFBF7] text-gray-900 min-h-screen flex flex-col justify-between font-sans">
        
        <Navbar />

        <div className="grow">{children}</div>

        {/* GLOBAL FOOTER */}
        <footer className="bg-white border-t border-gray-100 py-6 text-center text-sm text-gray-500 font-medium mt-auto">
          <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p>
              &copy; 2026{" "}
              <span className="font-serif font-bold text-[#7F1D1D]">
                TenunHub
              </span>
              . All Rights Reserved.
            </p>
            <p className="text-xs md:text-sm">
              Crafted by{" "}
              <a
                href="https://www.linkedin.com/in/2eight9"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#D97706] font-bold hover:underline"
              >
                Apriliano Boimau
              </a>
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
