'use client';

import { Card } from "@/components/ui/card";
import { FlaskConical, FileText, Hammer, ArrowRight } from "lucide-react";

export default function Process() {
  const steps = [
    {icon: FlaskConical, title: "R&D", description: "Find out if what you want to do with AI is possible before you start.", color: "text-primary"}, 
    {icon: FileText, title: "Proposal", description: "Discuss the scope and objectives. Determine timeline and milestones.", color: "text-secondary"}, 
    {icon: Hammer, title: "Build", description: "Execute the proposal with weekly progress reviews.", color: "text-accent"}
  ];
  
  return (
    <section id="process" className="py-24 relative overflow-hidden bg-gradient-to-b from-transparent via-muted/10 to-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 flex items-center justify-center gap-3">
          The<img src='https://images.fillout.com/orgid-432324/flowpublicid-g4lnna3r1f/widgetid-default/ccWejnUFvPJNvouSVsiL33/pasted-image-1759716559888.png' alt="Alakazam Labs Logo" className='h-10 md:h-12 w-auto inline-block pb-1 mb-[1px]' />Way
        </h2>

        <div className="max-w-6xl mx-auto relative">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
            {steps.map((step, i) => (
              <div key={i} className="relative">
                <Card className="p-8 text-center bg-card/50 backdrop-blur hover:scale-105 transition-transform w-full flex flex-col h-full">
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
                  <div 
                    className="hidden md:block absolute top-[45%] -right-[8%] z-20"
                    style={{ transform: 'translate(2px, calc(-50% + 4px))' }}
                  >
                    <ArrowRight className="w-8 h-8 text-accent" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
