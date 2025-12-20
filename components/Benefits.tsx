'use client';

import { Lightbulb, Link, Palette, Shield, Zap, Sparkles } from "lucide-react";

export default function Benefits() {
  const benefits = [
    { icon: Lightbulb, label: "Clarity", description: "Cut through overwhelm & confusion" },
    { icon: Palette, label: "Customization", description: "Lean into what makes your brand great" },
    { icon: Zap, label: "Speed", description: "Prototypes in hours, MVPs in weeks" },
    { icon: Shield, label: "Trust", description: "Reliable solutions in a busy world of AI" },
    { icon: Link, label: "Cohesion", description: "Integrate fragmented workflows" },
    { icon: Sparkles, label: "Design", description: "Elegant, brand-consistent, not clunky" }
  ];

  return (
    <section className="py-24 relative bg-gradient-to-b from-transparent via-muted/10 to-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 flex items-center justify-center gap-3">
          Why<img 
            src="https://images.fillout.com/orgid-432324/flowpublicid-g4lnna3r1f/widgetid-default/ccWejnUFvPJNvouSVsiL33/pasted-image-1759716559888.png" 
            alt="Alakazam Labs Logo" 
            className="h-10 md:h-12 w-auto inline-block pb-1 mb-[1px]"
          />?
        </h2>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {benefits.map((benefit, i) => (
            <div
              key={i}
              className="flex items-start gap-4 p-6 rounded-lg bg-card/50 backdrop-blur border border-border hover:border-accent/50 transition-colors"
            >
              <benefit.icon className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-lg mb-1">{benefit.label}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
