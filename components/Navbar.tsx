'use client';

import { Button } from "@/components/ui/button";
import { Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Proven Solutions', href: '/solutions' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  const handleNavClick = (href: string) => {
    setIsMobileMenuOpen(false);
    router.push(href);
  };

  return (
    <>
    <motion.div
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 24,
        mass: 0.9
      }}
      className="sticky top-0 left-0 right-0 z-[9999] transform-gpu will-change-transform px-4 pt-4"
    >
      <nav className="bg-background/95 border border-white/10 rounded-2xl shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] hover:shadow-[0_12px_48px_0_rgba(255,255,255,0.15)] transition-shadow duration-300 relative max-w-7xl mx-auto overflow-hidden">
        <div className="px-4 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-1.5 sm:gap-2 cursor-pointer z-50">
            <img 
              src="https://images.fillout.com/orgid-432324/flowpublicid-g4lnna3r1f/widgetid-default/ccWejnUFvPJNvouSVsiL33/pasted-image-1759716559888.png" 
              alt="Alakazam Labs Logo" 
              className="h-6 sm:h-7 w-auto" 
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative group text-sm font-medium text-foreground hover:text-accent transition-colors pb-1"
              >
                {link.name}
                {/* Yellow underline effect */}
                <span
                  className={`absolute bottom-0 left-0 h-0.5 bg-accent transition-all duration-300 ease-out ${
                    isActive(link.href)
                      ? 'w-full'
                      : 'w-0 group-hover:w-full'
                  }`}
                />
              </Link>
            ))}
          </div>

          {/* Desktop CTA Button */}
          <div className="hidden md:flex items-center">
            <Button
              size="sm"
              className="gold-shimmer bg-accent text-accent-foreground hover:bg-accent/90 text-sm px-4"
              onClick={() => router.push('/book')}
            >
              <Sparkles className="mr-2 w-4 h-4" />
              Book a Session
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2.5 rounded-md bg-accent text-accent-foreground hover:bg-accent/90 transition-colors z-50 gold-shimmer min-h-[44px] min-w-[44px] flex items-center justify-center"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={isMobileMenuOpen}
          >
            <motion.svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </motion.svg>
          </button>
        </div>
        
        {/* Mobile Menu - expands downward */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t border-white/10"
            >
              <div className="px-4 py-6 space-y-6">
                {navLinks.map((link, index) => (
                  <motion.div
                    key={link.href}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => handleNavClick(link.href)}
                      className={`block text-base font-medium transition-colors py-2 ${
                        isActive(link.href)
                          ? 'text-accent'
                          : 'text-foreground hover:text-accent'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ delay: navLinks.length * 0.05 }}
                  className="pt-2 border-t border-white/10"
                >
                  <Button
                    size="sm"
                    className="w-full gold-shimmer bg-accent text-accent-foreground hover:bg-accent/90 mt-4"
                    onClick={() => handleNavClick('/book')}
                  >
                    <Sparkles className="mr-2 w-4 h-4" />
                    Book a Session
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </motion.div>
    </>
  );
}
