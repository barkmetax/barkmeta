import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const display = Bebas_Neue({ weight: '400', subsets: ['latin'], variable: '--font-display-var' });
const body = Inter({ subsets: ['latin'], variable: '--font-body-var' });

export const metadata: Metadata = {
  title: 'Doginal Dogs TCG — Legends of the Pack',
  description:
    'The official Doginal Dogs Trading Card Game. Collect hand-pixeled legends, lead your pack, and battle for the Golden Bone. Volume 01 presale is live.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
