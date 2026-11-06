import { manrope } from '@/lib/fonts';
import { SITE } from '@/lib/site';
import { buildMetadata, organizationJsonLd } from '@/lib/seo';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './globals.css';

export const metadata = buildMetadata({
  title: null,
  description: SITE.description,
  path: '/',
});

export const viewport = {
  themeColor: '#00133E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  const jsonLd = organizationJsonLd();

  return (
    <html lang="en" className={manrope.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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