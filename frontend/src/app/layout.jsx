import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "Horizon Executive Terminal",
  description: "Sovereign Executive Dashboard",
  icons: {
    icon: [],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        <link rel="icon" href="data:," />
      </head>
      <body className="antialiased selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}
