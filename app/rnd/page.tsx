'use client';

import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function StartRND() {
  useEffect(() => {
    // Load Fillout embed script
    const script = document.createElement('script');
    script.src = 'https://server.fillout.com/embed/v1/';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      {/* Back Button */}
      <Link href="/">
        <Button
          variant="ghost"
          className="fixed bottom-4 left-4 z-50 text-white hover:bg-white/20 hover:text-accent backdrop-blur-sm"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </Link>

      {/* Fillout Form Embed */}
      <div
        data-fillout-id="k2fjwcbPUnus"
        data-fillout-embed-type="fullscreen"
        style={{ width: '100%', height: '100%' }}
        data-fillout-inherit-parameters
        data-fillout-domain="forms.discover-nocode.com"
      />
    </div>
  );
}
