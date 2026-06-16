import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Next.js Interactive Algorithm Engine Sandbox',
  description: 'A performance optimization game using procedural generation and A* Search heuristics.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="bg-slate-950">
      <body className={`${inter.className} text-slate-100 antialiased m-0 padding-0`}>
        {children}
      </body>
    </html>
  );
}