import { manrope } from '@/lib/fonts';
import { siteMetadata } from '@/lib/seo';
import { siteGraph } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata = siteMetadata();

export const viewport = {
  themeColor: '#00133E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <JsonLd data={siteGraph()} />
        <link
          rel="alternate"
          type="application/rss+xml"
          title="AniLine Journal"
          href="/journal/rss.xml"
        />
        {/* Revealed sections start hidden for Motion; without JS they must never stay hidden. */}
        <noscript>
          <style>{'.reveal{opacity:1!important;transform:none!important}'}</style>
        </noscript>
      </head>
      <body className="flex min-h-dvh flex-col">
        <a href="#main-content" className="skip-link">
          Skip to main content
        </a>
        <Header />
        <main id="main-content" className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
