import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
export default function Navbar() {
  const navigate = useNavigate();
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth"
    });
  };
  return <motion.div initial={{
    y: -80
  }} animate={{
    y: 0
  }} whileHover={{
    y: -4
  }} transition={{
    type: "spring",
    stiffness: 260,
    damping: 24,
    mass: 0.9
  }} className="fixed top-4 left-4 right-4 mx-auto w-auto max-w-6xl z-[9999]
                 transform-gpu will-change-transform">
      <nav className="bg-background/60 backdrop-blur-2xl border border-white/10 rounded-2xl
                   shadow-[0_8px_32px_0_rgba(255,255,255,0.1)]
                   hover:shadow-[0_12px_48px_0_rgba(255,255,255,0.15)]
                   transition-shadow duration-300">
        <div className="px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2 cursor-pointer" onClick={() => scrollToSection("hero")}>
            <img src="https://images.fillout.com/orgid-432324/flowpublicid-g4lnna3r1f/widgetid-default/ccWejnUFvPJNvouSVsiL33/pasted-image-1759716559888.png" alt="Alakazam AI Logo" className="h-6 sm:h-7 w-auto" />
          </div>

          <div className="hidden md:flex items-center gap-8">
            <button onClick={() => scrollToSection("solutions")} className='text-sm hover:text-accent transition-colors'>Path</button>
            <button onClick={() => scrollToSection("process")} className="text-sm hover:text-accent transition-colors">Process</button>
            <button onClick={() => scrollToSection("proof")} className="text-sm hover:text-accent transition-colors">Proof</button>
            <button onClick={() => scrollToSection("faq")} className="text-sm hover:text-accent transition-colors">FAQ</button>
          </div>

          <Button size="sm" className="gold-shimmer bg-accent text-accent-foreground hover:bg-accent/90 text-sm sm:text-base px-3 sm:px-4" onClick={() => navigate('/book')}>
            <Sparkles className="mr-2 w-4 h-4" />
            Book a Session
          </Button>
        </div>
      </nav>
    </motion.div>;
}

