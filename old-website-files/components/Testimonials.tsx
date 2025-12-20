import { Card } from "@/components/ui/card";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
export default function Testimonials() {
  const testimonials = [
  { quote: "After having multiple less than great experiences with consultants, we now have one consultant we trust to work in our best interest.", author: "Jeff Braddock", role: "COO, RPM A-V Services"},
  { quote: "Rosson and team are exactly what you look for in a development partner. We have had them develop multiple apps for us.", author: "Adam Vodanovich", role: "Vice President, Montimber"},
  { quote: "Rosson and Baden have gone above and beyond to think through the user experience, find solutions to problems we wouldn't have discovered.", author: "Clint Stitser", role: "Principal, Stitser BUILT."}
  ];
  return <section id="proof" className="py-24 relative bg-gradient-to-b from-transparent via-muted/10 to-transparent">
      <div className="container mx-auto px-6 relative z-10">
        <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-4xl md:text-5xl font-bold text-center mb-16">
          Trusted by <span className='gradient-text'>Entrepreneurs</span>
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {testimonials.map((testimonial, i) => <div key={i}>
              <Card className="p-8 h-full bg-card/50 backdrop-blur hover:border-accent/50 transition-colors">
                <Quote className="w-8 h-8 text-accent mb-4 opacity-50" />
                <p className="text-lg mb-6 italic">"{testimonial.quote}"</p>
                <div className="border-t border-border pt-4">
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground mb-2">{testimonial.role}</p>
                  
                </div>
              </Card>
            </div>)}
        </div>
      </div>
    </section>;
}

