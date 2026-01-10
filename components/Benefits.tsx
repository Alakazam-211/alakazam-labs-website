'use client';

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Benefits() {
  const router = useRouter();
  
  return (
    <section className="py-24 relative bg-gradient-to-b from-transparent via-muted/10 to-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <p className="text-xl md:text-2xl text-foreground mb-8">
            Want to explore what's possible? Book a workshop to discuss and build anything you want.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-10 py-7 gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent border-2 border-accent focus-visible:ring-0"
            onClick={() => router.push('/book')}
          >
            <Sparkles className="mr-2" />
            Book Workshop
          </Button>
        </div>
      </div>
    </section>
  );
}
