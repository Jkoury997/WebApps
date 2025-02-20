import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Zalei - Fichaqui",
  description: "App creada única y exclusivamente para fichar en Zalei Agropecuaria",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Incluir el manifest para la PWA */}
        <link rel="manifest" href="/manifest.json" />
        {/* Meta tag para el color de tema */}
        <meta name="theme-color" content="#000000" />
        {/* Otros meta tags necesarios */}
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
