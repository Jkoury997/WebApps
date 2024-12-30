import { Inter } from "next/font/google";
import "driver.js/dist/driver.css";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Marcela Koury Puntos",
  description: "App Creada unica y exclusivamente para clientes de Marcela Koury by MakeYou Srl",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
