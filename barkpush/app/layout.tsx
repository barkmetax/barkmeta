import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'BarkPush - Get Your Brand Published on Major News Sites',
  description:
    'Press release distribution to 400+ news outlets. Build trust, rank on Google, and dominate AI search results. Starting at $195.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="antialiased">
      <body className="min-h-screen bg-[#0a0a0a] text-[#f5f5f5]" style={{ fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
