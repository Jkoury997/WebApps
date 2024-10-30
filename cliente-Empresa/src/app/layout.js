import { Inter } from "next/font/google";
import "./globals.css";
import Head from "next/head"; // Importa el componente Head

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Zalei Agropecuaria S.A.",
  description: "Empresa Argentina",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
      </Head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}