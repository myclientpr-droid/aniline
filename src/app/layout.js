import { manrope } from '@/lib/fonts';
import { siteMetadata } from '@/lib/seo';
import { siteGraph } from '@/lib/schema';
import JsonLd from '@/components/seo/JsonLd';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import ToastProvider from '@/components/admin/ToastProvider';
import { GoogleAnalytics } from '@next/third-parties/google';
import './globals.css';

// Local dev and preview deployments would otherwise post their traffic to the same property as
// real visitors, so the snippet is emitted only on a production render.
const GA_MEASUREMENT_ID =
  process.env.NODE_ENV === 'production' ? process.env.GA_MEASUREMENT_ID : undefined;
const GSC_SITE_VERIFICATION = process.env.NODE_ENV === 'production' ? process.env.GSC_SITE_VERIFICATION : undefined;
export const metadata = siteMetadata();

export const viewport = {
  themeColor: '#00133E',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={manrope.variable} data-scroll-behavior="smooth">
      <head>
        <meta name='google-site-verification' content={GSC_SITE_VERIFICATION} />
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
        <ToastProvider>
          <a href="#main-content" className="skip-link">
            Skip to main content
          </a>
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
        </ToastProvider>
        {GA_MEASUREMENT_ID && <GoogleAnalytics gaId={GA_MEASUREMENT_ID} />}
      </body>
    </html>
  );
}
