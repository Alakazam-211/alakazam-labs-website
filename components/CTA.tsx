'use client';

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

export default function CTA() {
  const router = useRouter();
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 aura-gradient" />
      {/* Replaced JS animation with CSS for better performance */}
      <div className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full aura-gradient-blue blur-3xl opacity-40 cta-bg-animation" />
      
      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Let's Make <span className="gradient-text">Magic</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Transform your business with AI that feels effortless and looks extraordinary.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-10 py-7 gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => router.push('/book')}
          >
            <Sparkles className="mr-2" />
            Book Your Magic Session
          </Button>
        </div>
      </div>
    </section>
  );
}
