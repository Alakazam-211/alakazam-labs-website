'use client';

import { Card } from "@/components/ui/card";
import { Eye, Wand2, Rocket, Sparkles, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function Process() {
  const steps = [{icon: Wand2, title: "Magic", description: "Get your prototype or skinned template", color: "text-yellow-500"}, {icon: Eye, title: "Future Sight", description: "We uncover your needs and understand your vision", color: "text-secondary"}, {icon: Sparkles, title: "Conjure", description: "Implement Future Sight and complete your custom MVP", color: "text-primary"}, {icon: Rocket, title: "Deploy", description: "Launch your MVP, get it into users hands", color: "text-accent"}];
  return <section id="process" className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-muted/10 to-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <motion.h2 initial={{opacity: 0, y: 20}} whileInView={{opacity: 1, y: 0}} viewport={{once: true}} className="text-4xl md:text-5xl font-bold text-center mb-16 flex items-center justify-center gap-3">
          The<img src='https://images.fillout.com/orgid-432324/flowpublicid-g4lnna3r1f/widgetid-default/ccWejnUFvPJNvouSVsiL33/pasted-image-1759716559888.png' alt="Alakazam AI Logo" className='h-10 md:h-12 w-auto inline-block pb-1 mb-[1px]' />Way
        </motion.h2>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <Card className="p-8 text-center bg-card/50 backdrop-blur hover:scale-105 transition-transform w-full flex flex-col h-full" style={{ willChange: 'transform', transform: 'translateZ(0)' }}>
                  <div className="mb-6 flex justify-center">
                    <div className={`w-16 h-16 rounded-full bg-background border-2 border-current ${step.color} flex items-center justify-center`}>
                      <step.icon className="w-8 h-8" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
                  <p className="text-muted-foreground flex-1">{step.description}</p>
                </Card>
                
                {/* Arrow positioned absolutely between cards */}
                {i < steps.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.2 }}
                    className="hidden md:block absolute top-[45%] -translate-y-1/2 -right-[12%] z-20"
                  >
                    <ArrowRight className="w-8 h-8 text-accent" />
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>;
}

