import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Sparkles, ExternalLink } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import SEOHead from "@/components/SEOHead";
import { getSolutions, GetSolutionsOutputType } from "zite-endpoints-sdk";

export default function Templates() {
  const navigate = useNavigate();
  const [solutions, setSolutions] = useState<GetSolutionsOutputType['solutions']>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolutions = async () => {
      try {
        const data = await getSolutions({});
        setSolutions(data.solutions);
      } catch (error) {
        console.error("Error fetching solutions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSolutions();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <SEOHead 
        title="Solution Catalog - Alakazam AI"
        description="Browse our collection of proven, production-ready AI solutions. Battle-tested templates ready to customize for your business."
        url="https://alakazam.digital/solutions"
      />
      <Navbar />
      <div className="relative">
        <div className="relative">
          <section className="py-32 relative">
            <div className="container mx-auto px-4 md:px-6 relative z-10">
              <Button
                variant="ghost"
                onClick={() => navigate('/')}
                className="mb-8 text-muted-foreground hover:text-black"
              >
                <ArrowLeft className="mr-2 w-4 h-4" />
                Back to Home
              </Button>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-16"
              >
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
                  Solution <span className="gradient-text">Catalog</span>
                </h1>
                <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto'>Browse our collection of proven, production-ready solutions. Each one is battle-tested and ready to customize.</p>
              </motion.div>

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                  <p className="mt-4 text-muted-foreground">Loading solutions...</p>
                </div>
              ) : solutions.length === 0 ? (
                <div className="text-center py-12">
                  <p className='text-muted-foreground mb-6'>We're curating our best solutions for you. Check back soon!</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {solutions.map((solution, i) => (
                    <motion.div
                      key={solution.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="p-6 h-full flex flex-col bg-card/50 backdrop-blur hover:border-accent/30 transition-all">
                        {solution.thumbnail && solution.thumbnail[0] && (
                          <div className="mb-4 rounded-lg overflow-hidden">
                            <img 
                              src={solution.thumbnail[0].url} 
                              alt={solution.solutionTitle || "Solution"}
                              className="w-full h-48 object-cover"
                            />
                          </div>
                        )}
                        
                        <div className="mb-4 flex-grow">
                          <h3 className="text-2xl font-bold mb-2">{solution.solutionTitle}</h3>
                          <p className="text-muted-foreground text-sm">
                            {solution.description}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2">
                          {solution.url && (
                            <Button 
                              onClick={() => window.open(solution.url, '_blank')}
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              <ExternalLink className="mr-2 w-4 h-4" />
                              View Solution
                            </Button>
                          )}
                          <Button 
                            onClick={() => window.open('https://discovernocode.fillout.com/rosson-long-30', '_blank')}
                            className="w-full gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90"
                          >
                            <Sparkles className="mr-2 w-4 h-4" />
                            Book a Demo
                          </Button>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              )}

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="text-center mt-16"
              >
                <p className="text-muted-foreground mb-6">
                  Don't see what you need?
                </p>
                <Button 
                  size="lg"
                  className="gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90"
                  onClick={() => navigate('/book')}
                >
                  <Sparkles className="mr-2" />
                  Request a Custom Build
                </Button>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
    </div>
  );
}
