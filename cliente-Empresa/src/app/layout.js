import { Inter } from "next/font/google";
import "./globals.css";

const APP_NAME = "Zalei App";
const APP_DEFAULT_TITLE = "Zalei Agropecuaria S.A. App";
const APP_TITLE_TEMPLATE = "Zalei App";
const APP_DESCRIPTION = "Best PWA app in the world!";

const inter = Inter({ subsets: ["latin"] });

// API de Metadata de Next.js
export const metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: APP_NAME,
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
  twitter: {
    card: "summary",
    title: {
      default: APP_DEFAULT_TITLE,
      template: APP_TITLE_TEMPLATE,
    },
    description: APP_DESCRIPTION,
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      {/* El objeto `metadata` maneja automáticamente los metadatos */}
      <body className={inter.className}>{children}</body>
    </html>
  );
}
