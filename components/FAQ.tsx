'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { getFaqs, GetFaqsOutputType } from "@/lib/zite-endpoints-sdk";

export default function FAQ() {
  const [faqs, setFaqs] = useState<GetFaqsOutputType['faqs']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const data = await getFaqs({});
        setFaqs(data.faqs);
      } catch (error) {
        console.error("Error fetching FAQs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchFaqs();
  }, []);

  return (
    <section id="faq" className="pt-24 pb-12 bg-gradient-to-b from-transparent via-muted/10 to-transparent">
      <div className="container mx-auto px-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Frequently Asked <span className="gradient-text">Questions</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto"
        >
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent" style={{ animationDuration: '0.8s', willChange: 'transform' }}></div>
              <p className="mt-4 text-muted-foreground">Loading FAQs...</p>
            </div>
          ) : faqs.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">No FAQs available at the moment.</p>
            </div>
          ) : (
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, i) => (
                <AccordionItem key={faq.id} value={`item-${i}`} className="border border-border rounded-lg px-6 bg-card/50 backdrop-blur" style={{ transform: 'translateZ(0)' }}>
                  <AccordionTrigger className="text-left hover:text-accent hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </motion.div>
      </div>
    </section>
  );
}

