import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service - Alakazam AI",
  description: "Terms of Service for Alakazam AI. Learn about our service terms and conditions.",
};

export default function Terms() {
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

            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                Terms of <span className="gradient-text">Service</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground mb-10">
                Coming Soon!
              </p>
              <p className="text-muted-foreground">
                We're working on our Terms of Service. Please check back soon or contact us at{" "}
                <a href="mailto:hello@alakazamlabs.com" className="text-accent hover:underline">
                  hello@alakazamlabs.com
                </a>{" "}
                for any questions.
              </p>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

