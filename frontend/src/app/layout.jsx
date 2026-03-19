import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ 
  subsets: ['latin'],
  display: 'swap',
});

// --- NEW: METADATA (Mallattoo Next.js balleessuuf) ---
export const metadata = {
  title: 'Horizon Executive Terminal',
  description: 'Sovereign Executive Dashboard',
  icons: {
    icon: [], // Kun favicon Next.js akka hin mul'anne godha
    // Yoo logo mataa kee qabaatte immoo bifa kanaan itti dabali:
    // icon: '/favicon.ico', 
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.className}>
      <head>
        {/* Sararri kun mallattoo default san dhiibee balleessa */}
        <link rel="icon" href="data:," />
      </head>
      <body className="antialiased selection:bg-slate-900 selection:text-white">
        {children}
      </body>
    </html>
  );
}