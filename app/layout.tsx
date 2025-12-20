import type { Metadata } from 'next';
import './globals.css';
import CookieConsent from '@/components/CookieConsent';
import { PageTrackingProvider } from '@/components/PageTrackingProvider';

export const metadata: Metadata = {
  title: 'Alakazam AI - Results So Fast They Feel Like Magic',
  description: 'Get a working prototype app by the end of your first session. Transform your business with AI solutions delivered in hours, not months.',
  openGraph: {
    title: 'Alakazam AI - Results So Fast They Feel Like Magic',
    description: 'Get a working prototype app by the end of your first session. Transform your business with AI solutions delivered in hours, not months.',
    url: 'https://alakazam.digital',
    siteName: 'Alakazam AI',
    images: [
      {
        url: 'https://images.fillout.com/orgid-432324/flowpublicid-g4lnna3r1f/widgetid-default/ccWejnUFvPJNvouSVsiL33/pasted-image-1759716559888.png',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alakazam AI - Results So Fast They Feel Like Magic',
    description: 'Get a working prototype app by the end of your first session. Transform your business with AI solutions delivered in hours, not months.',
    images: ['https://images.fillout.com/orgid-432324/flowpublicid-g4lnna3r1f/widgetid-default/ccWejnUFvPJNvouSVsiL33/pasted-image-1759716559888.png'],
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

