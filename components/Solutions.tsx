'use client';

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Solutions() {
  const router = useRouter();

  const paths = [
    {
      title: "Custom White-Glove",
      description: "Work directly with us to build your custom app from scratch. We'll prototype it in your first session and deliver a production-ready MVP in days, not months.",
      features: [
        "Custom-built for your exact needs",
        "Working prototype in first session",
        "Full production deployment",
        "Ongoing support & iterations"
      ],
      cta: "Book Your Magic Session",
      highlight: true,
      action: () => router.push('/book')
    },
    {
      title: "Proven Solutions",
      description: "Start with one of our proven solutions and customize it to match your brand and workflow. Get up and running in hours with a battle-tested foundation.",
      features: [
        "Pre-built, proven solutions",
        "Quick customization & branding",
        "Faster time to market",
        "Cost-effective approach"
      ],
      cta: "Browse Proven Solutions",
      highlight: false,
      action: () => router.push('/solutions')
    }
  ];

  return (
    <section id="solutions" className="py-24 relative bg-gradient-to-b from-transparent via-muted/10 to-transparent">
      <div className="absolute inset-0 aura-gradient opacity-50" />
      <div className="container mx-auto px-6 relative z-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Pick your <span className="gradient-text">Path</span>
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {paths.map((path, i) => (
            <div key={i}>
              <Card className={`p-8 h-full flex flex-col ${
                path.highlight 
                  ? 'bg-card/80 backdrop-blur border-accent/50 gold-shimmer' 
                  : 'bg-card/50 backdrop-blur hover:border-accent/30'
              } transition-colors`} style={{ transform: 'translateZ(0)' }}>
                <div className="mb-6">
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">{path.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {path.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 flex-grow">
                  {path.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <ArrowRight className="w-5 h-5 text-accent mt-0 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  size="lg" 
                  onClick={path.action}
                  className={`w-full ${
                    path.highlight 
                      ? 'gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90' 
                      : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }`}
                >
                  {path.highlight && <Sparkles className="mr-2 w-4 h-4" />}
                  {path.cta}
                  {!path.highlight && <ArrowRight className="ml-2 w-4 h-4" />}
                </Button>
              </Card>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

