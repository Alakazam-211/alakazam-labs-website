import type { Metadata, Viewport } from 'next';
import { Montserrat } from 'next/font/google';
import { Analytics } from '@vercel/analytics/react';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import { PageTrackingProvider } from '@/components/PageTrackingProvider';

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-montserrat',
});

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  metadataBase: new URL('https://alakazamlabs.com'),
  title: 'Alakazam Labs - Results So Fast They Feel Like Magic',
  description: 'Get a working prototype app by the end of your first session. Transform your business with AI solutions delivered in hours, not months.',
  icons: {
    icon: '/favicon.jpg',
    shortcut: '/favicon.jpg',
    apple: '/favicon.jpg',
  },
  openGraph: {
    title: 'Alakazam Labs - Results So Fast They Feel Like Magic',
    description: 'Get a working prototype app by the end of your first session. Transform your business with AI solutions delivered in hours, not months.',
    url: 'https://alakazamlabs.com',
    siteName: 'Alakazam Labs',
    images: [
      {
        url: '/social-image.png',
        width: 1200,
        height: 630,
        alt: 'Alakazam Labs',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alakazam Labs - Results So Fast They Feel Like Magic',
    description: 'Get a working prototype app by the end of your first session. Transform your business with AI solutions delivered in hours, not months.',
    images: ['/social-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={montserrat.variable}>
        <PageTrackingProvider>
          {children}
          <CookieConsent />
        </PageTrackingProvider>
        <Analytics />
      </body>
    </html>
  );
}

