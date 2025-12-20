import { Sparkles } from "lucide-react";
export default function Footer() {
  return <footer className="border-t border-border bg-background/50 backdrop-blur">
      <div className="container mx-auto px-6 py-12">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="https://images.fillout.com/orgid-432324/flowpublicid-g4lnna3r1f/widgetid-default/ccWejnUFvPJNvouSVsiL33/pasted-image-1759716559888.png" alt="Alakazam AI Logo" className="h-8 w-auto" />
          </div>

          <div className="flex gap-6 text-sm text-muted-foreground">
            <a href="/terms" className="hover:text-accent transition-colors">Terms</a>
            <a href="/privacy" className="hover:text-accent transition-colors">Privacy</a>
            <a href="mailto:hello@alakazam.digital" className="hover:text-accent transition-colors">Contact</a>
          </div>

          <div className='text-sm text-muted-foreground'>© 2025 LZTEK, LLC dba Alakazam Labs.</div>
        </div>
      </div>
    </footer>;
}

