'use client';

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string>("");

  const footerLinks = [
    { name: "Home", href: "/" },
    { name: "Solutions", href: "/solutions" },
    { name: "Contact", href: "/contact" },
  ];


  return (
    <footer className="relative mt-8 sm:mt-12 md:mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 pb-8 sm:pb-10">
        {/* Let's Work Together Section - Top, Full Width */}
        <div className="mb-12 sm:mb-16 md:mb-20 text-center">
          <h4 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 sm:mb-8 text-foreground">
            Let's Work Together
          </h4>
          <Link href="/book" className="inline-block">
            <Button className="gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto text-sm sm:text-base group flex items-center justify-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Book a Session
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Alakazam and Quick Links - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 lg:gap-12 mb-8 sm:mb-10">
          {/* Logo & Description Section */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-3 sm:mb-4">
              <img 
                src="https://images.fillout.com/orgid-432324/flowpublicid-g4lnna3r1f/widgetid-default/ccWejnUFvPJNvouSVsiL33/pasted-image-1759716559888.png" 
                alt="Alakazam Labs Logo" 
                className="h-8 w-auto" 
              />
            </Link>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-md">
              Professional AI solutions delivered in hours, not months. Transform your business with production-ready apps.
            </p>
          </div>

          {/* Quick Links Section */}
          <div>
            <h4 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-foreground">
              Quick Links
            </h4>
            <ul className="space-y-2 sm:space-y-3">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm sm:text-base text-muted-foreground hover:text-foreground transition-colors block"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Section - Bottom, Full Width */}
        <div className="border-t border-border pt-6 sm:pt-8">
          <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-foreground">
            Join our newsletter
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6 leading-relaxed">
            Subscribe to the Discover NoCode newsletter for updates on AI solutions, new features, and business automation tips delivered to your inbox.
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!email || isSubmitting) return;

              setIsSubmitting(true);
              setSubmitStatus(null);
              setErrorMessage("");

              try {
                const response = await fetch('/api/newsletter', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({ email }),
                });

                const data = await response.json();

                if (!response.ok) {
                  throw new Error(data.error || 'Failed to subscribe');
                }

                setSubmitStatus("success");
                setEmail("");
                setTimeout(() => setSubmitStatus(null), 5000);
              } catch (error) {
                console.error("Newsletter subscription error:", error);
                const errMsg = error instanceof Error ? error.message : "Something went wrong. Please try again.";
                setErrorMessage(errMsg);
                setSubmitStatus("error");
                setTimeout(() => {
                  setSubmitStatus(null);
                  setErrorMessage("");
                }, 5000);
              } finally {
                setIsSubmitting(false);
              }
            }}
            className="bg-card/80 backdrop-blur rounded-xl p-3 sm:p-4 border border-border max-w-2xl"
          >
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 rounded-lg px-3 py-2 sm:px-4 sm:py-2.5 text-sm w-full bg-background/80 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                required
              />
              <Button
                type="submit"
                className="gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90 w-full sm:w-auto text-sm whitespace-nowrap disabled:opacity-50"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Subscribing..." : submitStatus === "success" ? "Subscribed!" : "Subscribe"}
              </Button>
            </div>
            {submitStatus === "success" && (
              <p className="text-xs text-green-400 mt-3 text-center sm:text-left">
                Successfully subscribed! Check your email.
              </p>
            )}
            {submitStatus === "error" && (
              <p className="text-xs text-red-400 mt-3 text-center sm:text-left">
                {errorMessage || "Something went wrong. Please try again."}
              </p>
            )}
          </form>
        </div>

        {/* Copyright & Links */}
        <div className="mt-8 sm:mt-10 pt-6 sm:pt-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="flex flex-col gap-2">
              <p className="text-muted-foreground text-xs sm:text-sm text-center sm:text-left">
                © 2025 LZTEK, LLC dba Alakazam Labs.
              </p>
              <p className="text-muted-foreground text-xs text-center sm:text-left">
                Software built with Alakazam is proudly hosted by LZTEK, LLC.
              </p>
            </div>
            <div className="flex gap-6 text-xs sm:text-sm text-muted-foreground">
              <Link href="https://lztek.io" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                LZTEK
              </Link>
              <Link href="/terms" className="hover:text-foreground transition-colors">
                Terms
              </Link>
              <Link href="/privacy" className="hover:text-foreground transition-colors">
                Privacy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
