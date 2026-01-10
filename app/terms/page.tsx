import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Terms of Service - Alakazam Labs",
  description: "Terms of Service for Alakazam Labs. Learn about our service terms and conditions.",
};

export default function Terms() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <Navbar />
      <div className="relative flex-grow">
        <section className="py-32 relative">
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center">
                Terms of <span className="gradient-text">Service</span>
              </h1>
              
              <div className="prose prose-invert max-w-none mt-12">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">30-Day Money Back Guarantee</h2>
                <p className="text-muted-foreground mb-4">
                  We stand behind our work with a 30-day money back guarantee. If you're not satisfied with our services, you can request a full refund within 30 days of the delivered product/experience.
                </p>
                <p className="text-muted-foreground mb-4">
                  <strong>Refund Calculation:</strong> The refund amount will be calculated by subtracting the value of time spent on your project from your total payment:
                </p>
                <ul className="list-disc list-inside text-muted-foreground mb-4 space-y-2">
                  <li>Workshop sessions: $50 per hour</li>
                  <li>R&D services: $50 per hour</li>
                  <li>Build services: $75 per hour</li>
                </ul>
                <p className="text-muted-foreground mb-4">
                  For example, if you paid $5,000 and we spent 20 hours on R&D ($1,000) and 10 hours on Build ($750), your refund would be $5,000 - $1,750 = $3,250.
                </p>
                <p className="text-muted-foreground mb-8">
                  <strong>Ownership of Work Product:</strong> If you choose to pursue a refund, LZTEK, LLC dba Alakazam Labs will retain ownership of all work product, code, research, documentation, and any other materials created during the R&D or Build services. You will not have rights to use, reproduce, or distribute any work product created during the refunded services.
                </p>
                
                <h2 className="text-2xl md:text-3xl font-bold mb-4 mt-12">General Terms</h2>
                <p className="text-muted-foreground mb-4">
                  We're working on completing our full Terms of Service. Please check back soon or contact us at{" "}
                  <a href="mailto:hello@alakazamlabs.com" className="text-accent hover:underline">
                    hello@alakazamlabs.com
                  </a>{" "}
                  for any questions.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
}

