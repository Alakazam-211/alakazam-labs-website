'use client';

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Sparkles, Rocket } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useEffect } from "react";
import Link from "next/link";

export default function Comparison() {
  const router = useRouter();

  return (
    <section className="pt-32 pb-16 md:pt-24 md:pb-24 relative bg-transparent z-[3] overflow-visible">
      <div className="container mx-auto px-4 md:px-6 relative z-[3]">
        <div className="max-w-3xl mx-auto p-6 md:p-8">
          {/* Updated Badge */}
          <div className="flex items-center justify-center gap-2 mb-8 md:mb-12">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" style={{ animationDuration: '2s' }}></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-sm text-muted-foreground">Updated on: January 10th, 2026</span>
          </div>

          {/* Main Content - no scroll animations on paragraphs */}
          <div className="space-y-6 md:space-y-8 text-left md:text-center">
            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
              Seven months ago, AI app builders were toys. Sloppy, unreliable. 
              Now? They are <span className="gradient-text font-semibold">powerful tools</span>. And people are starting to notice.
            </p>

            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
              There's a short window before the market wakes up. 
              Early movers will own the field while others are still figuring it out.
            </p>

            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
              You already have the idea, you're thinking of it right now. 
            </p>

            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
              For the first time, you can move at the <span className="gradient-text font-semibold">speed of thought</span>:<br />
              a prototype in hours, an MVP in weeks.
            </p>

            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
              Not a concept. A <span className="gradient-text font-semibold">real working product</span>.
            </p>

            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed font-semibold">
              This is rare. A once-in-a-lifetime shift.
            </p>

            <p className="text-lg md:text-xl lg:text-2xl leading-relaxed">
              You see the gaps. You know the players.<br />
              Now you have the AI partner to make it real.
            </p>

            <div className="pt-6 md:pt-8 space-y-4">
              <p className="text-xl md:text-2xl lg:text-3xl font-bold gradient-text">
                Let's build it. Choose your path.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button 
                  size="lg" 
                  className="text-base md:text-lg px-8 md:px-10 py-5 md:py-7 gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent border-2 border-accent focus-visible:ring-0 w-full sm:w-auto"
                  onClick={() => router.push('/book')}
                >
                  <Sparkles className="mr-2" />
                  Book Workshop
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-base md:text-lg px-8 md:px-10 py-5 md:py-7 border-2 border-accent/50 text-accent hover:bg-accent/10 hover:text-accent w-full sm:w-auto"
                  onClick={() => router.push('/rnd')}
                >
                  <Rocket className="mr-2" />
                  Start R&D
                </Button>
              </div>

              <p className="text-base md:text-lg text-muted-foreground pt-4">
                You'll have a prototype in your hands or your money back.<br />
                There's nothing to lose. Everything to gain.
              </p>
              <p className="text-sm text-muted-foreground">
                <Link 
                  href="/terms" 
                  className="hover:underline transition-all"
                >
                  30-day money back guarantee<sup className="text-accent">*</sup>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

