import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function CTA() {
  const navigate = useNavigate();
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 aura-gradient" />
      <motion.div
        className="absolute top-1/2 left-1/2 w-96 h-96 rounded-full aura-gradient-blue blur-3xl opacity-40"
        animate={{ scale: [1, 1.3, 1], rotate: [0, 180, 360] }}
        transition={{ duration: 15, repeat: Infinity }}
      />
      
      <div className="container mx-auto px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="text-5xl md:text-6xl font-bold mb-6">
            Let's Make <span className="gradient-text">Magic</span>
          </h2>
          <p className="text-xl text-muted-foreground mb-10">
            Transform your business with AI that feels effortless and looks extraordinary.
          </p>
          <Button 
            size="lg" 
            className="text-lg px-10 py-7 gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90"
            onClick={() => navigate('/book')}
          >
            <Sparkles className="mr-2" />
            Book Your Magic Session
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

