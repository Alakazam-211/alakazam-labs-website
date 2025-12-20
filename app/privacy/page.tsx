import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Privacy Policy - Alakazam AI",
  description: "Privacy Policy for Alakazam AI. Learn how we protect your data and respect your privacy.",
};

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <Navbar />
      <div className="relative flex-grow">
        <section className="py-32 relative">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <Link href="/">
              <Button
                variant="ghost"
                className="mb-8 text-muted-foreground hover:text-black"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </Button>
            </Link>

            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-8 text-center">
                Privacy <span className="gradient-text">Policy</span>
              </h1>
              
              <div className="space-y-8 text-muted-foreground">
                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Analytics & Tracking</h2>
                  <p className="mb-4">
                    We use analytics services to understand how visitors interact with our website. 
                    This helps us improve your experience and provide better services.
                  </p>
                  <p className="mb-4">
                    <strong className="text-foreground">What we track:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Page views and navigation patterns</li>
                    <li>Time spent on pages</li>
                    <li>Device and browser information</li>
                    <li>Geographic location (country/city level)</li>
                    <li>Referral sources</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Cookies</h2>
                  <p className="mb-4">
                    We use cookies to remember your preferences and enhance your browsing experience. 
                    You can control cookie settings through our cookie consent banner or your browser settings.
                  </p>
                  <p>
                    <strong className="text-foreground">Types of cookies we use:</strong>
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4 mt-2">
                    <li><strong className="text-foreground">Essential cookies:</strong> Required for the website to function</li>
                    <li><strong className="text-foreground">Analytics cookies:</strong> Help us understand how you use our site</li>
                    <li><strong className="text-foreground">Preference cookies:</strong> Remember your settings and choices</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Your Rights</h2>
                  <p className="mb-4">
                    You have the right to:
                  </p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Opt-out of analytics tracking</li>
                    <li>Request deletion of your data</li>
                    <li>Access the information we have about you</li>
                    <li>Withdraw consent at any time</li>
                  </ul>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Data Security</h2>
                  <p>
                    We implement appropriate security measures to protect your personal information. 
                    However, no method of transmission over the internet is 100% secure, and we cannot 
                    guarantee absolute security.
                  </p>
                </div>

                <div>
                  <h2 className="text-2xl font-bold text-foreground mb-4">Contact Us</h2>
                  <p>
                    If you have questions about this Privacy Policy or how we handle your data, 
                    please contact us at{" "}
                    <a href="mailto:hello@alakazamlabs.com" className="text-accent hover:underline">
                      hello@alakazamlabs.com
                    </a>
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <p className="text-sm">
                    <strong className="text-foreground">Last Updated:</strong> January 2025
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

