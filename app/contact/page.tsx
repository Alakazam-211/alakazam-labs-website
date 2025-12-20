'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Mail, MessageSquare, Calendar, Sparkles } from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useEffect } from "react";

export default function ContactPage() {
  useEffect(() => {
    // Load Fillout embed script
    const script = document.createElement('script');
    script.src = 'https://server.fillout.com/embed/v1/';
    script.async = true;
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden flex flex-col">
      <Navbar />
      <div className="relative flex-grow">
        <div className="relative">
          <section className="py-32 relative">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                  Get in <span className="gradient-text">Touch</span>
                </h1>
                <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>
                  Have a question or ready to start your project? We'd love to hear from you.
                </p>
              </motion.div>

              <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
                {/* Contact Methods */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-6"
                >
                  <Card className="p-6 bg-card/50 backdrop-blur hover:border-accent/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-accent/10">
                        <Mail className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Email Us</h3>
                        <a 
                          href="mailto:hello@alakazamlabs.com" 
                          className="text-muted-foreground hover:text-accent transition-colors"
                        >
                          hello@alakazamlabs.com
                        </a>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-card/50 backdrop-blur hover:border-accent/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-accent/10">
                        <MessageSquare className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Book a Session</h3>
                        <p className="text-muted-foreground mb-4">
                          Schedule a free consultation to discuss your project
                        </p>
                        <Link href="/book">
                          <Button className="gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90">
                            <Sparkles className="mr-2 w-4 h-4" />
                            Book Now
                          </Button>
                        </Link>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-card/50 backdrop-blur hover:border-accent/30 transition-all">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-accent/10">
                        <Calendar className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold mb-2">Response Time</h3>
                        <p className="text-muted-foreground">
                          We typically respond within 24 hours during business days
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>

                {/* Contact Form */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card className="p-6 bg-card/50 backdrop-blur">
                    <h2 className="text-2xl font-bold mb-6">Send us a Message</h2>
                    <div
                      data-fillout-id="mZD56vi7Lxus"
                      data-fillout-embed-type="standard"
                      data-fillout-inherit-parameters
                      data-fillout-dynamic-resize
                      data-fillout-domain="forms.discover-nocode.com"
                      style={{ width: '100%', height: '500px' }}
                    />
                  </Card>
                </motion.div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mt-16"
              >
                <p className="text-muted-foreground mb-6">
                  Prefer to browse our solutions first?
                </p>
                <Link href="/solutions">
                  <Button 
                    size="lg"
                    variant="outline"
                    className="border-border hover:bg-muted hover:text-foreground"
                  >
                    View Solution Catalog
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}

