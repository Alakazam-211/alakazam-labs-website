import type { Metadata } from 'next';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import { PageTrackingProvider } from '@/components/PageTrackingProvider';

export const metadata: Metadata = {
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
    url: 'https://alakazam.digital',
    siteName: 'Alakazam Labs',
    images: [
      {
        url: 'https://alakazam.digital/social-image.png',
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
    images: ['https://alakazam.digital/social-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <PageTrackingProvider>
          {children}
          <CookieConsent />
        </PageTrackingProvider>
      </body>
    </html>
  );
}

