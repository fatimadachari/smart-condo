import type { Metadata } from "next";
import { Manrope } from "next/font/google"; // Importando a fonte
import "./globals.css";

// Configurando a fonte
const manrope = Manrope({ 
  subsets: ["latin"],
  variable: '--font-manrope',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "SmartCondo",
  description: "Gestão inteligente para condomínios.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${manrope.variable} font-sans bg-alabaster text-gunmetal-600 antialiased`}>
        {children}
      </body>
    </html>
  );
}