import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import SEOHead from '@/components/SEOHead';

export default function BookSession() {
  const navigate = useNavigate();

  useEffect(() => {
    // Load Fillout embed script
    const script = document.createElement('script');
    script.src = 'https://server.fillout.com/embed/v1/';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      // Cleanup script on unmount
      document.body.removeChild(script);
    };
  }, []);

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <SEOHead 
        title="Book Your Magic Session - Alakazam AI"
        description="Schedule your first session and get a working prototype by the end of it. Fast, professional AI solutions tailored to your needs."
        url="https://alakazam.digital/book"
      />
      {/* Back Button */}
      <Button
        onClick={() => navigate(-1)}
        variant="ghost"
        className="fixed bottom-4 left-4 z-50 text-white hover:bg-white/20 hover:text-accent backdrop-blur-sm"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Home
      </Button>

      {/* Fillout Form Embed */}
      <div
        data-fillout-id="nxZRvfqVcdus"
        data-fillout-embed-type="fullscreen"
        style={{ width: '100%', height: '100%' }}
        data-fillout-inherit-parameters
      />
    </div>
  );
}

