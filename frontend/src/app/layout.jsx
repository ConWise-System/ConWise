import { UserProvider } from '../context/UserContext';
import { NotificationProvider } from '../context/NotificationContext';
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

export const metadata = {
  title: "ConWise",
  description: "Construction Project Collaboration and Reporting system",
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
        <UserProvider>
          <NotificationProvider>
          {children}
          </NotificationProvider>
        </UserProvider>
      </body>
    </html>
  );
}
