'use client';

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Sparkles, ExternalLink, Search, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ImagePreviewModal from "@/components/ImagePreviewModal";
import { getSolutions, GetSolutionsOutputType } from "@/lib/zite-endpoints-sdk";

export default function SolutionsPage() {
  const [solutions, setSolutions] = useState<GetSolutionsOutputType['solutions']>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [previewImage, setPreviewImage] = useState<{ url: string; alt: string } | null>(null);

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

  // Filter solutions based on search query
  const filteredSolutions = solutions.filter((solution) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    const title = (solution.solutionTitle || '').toLowerCase();
    const description = (solution.description || '').toLowerCase();
    return title.includes(query) || description.includes(query);
  });

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
                  Solution <span className="gradient-text">Catalog</span>
                </h1>
                <p className='text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8'>Browse our collection of proven, production-ready solutions. Each one is battle-tested and ready to customize.</p>
              </motion.div>

              {/* Search Input */}
              {!loading && solutions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="max-w-2xl mx-auto mb-12"
                >
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white z-20 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Search solutions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-4 py-3 bg-card/50 backdrop-blur border border-white/10 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/50 transition-all"
                    />
                  </div>
                  {searchQuery && (
                    <p className="text-sm text-muted-foreground mt-3 text-center">
                      {filteredSolutions.length === 0 
                        ? 'No solutions found matching your search.'
                        : `Found ${filteredSolutions.length} ${filteredSolutions.length === 1 ? 'solution' : 'solutions'}`}
                    </p>
                  )}
                </motion.div>
              )}

              {loading ? (
                <div className="text-center py-12">
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-accent"></div>
                  <p className="mt-4 text-muted-foreground">Loading solutions...</p>
                </div>
              ) : solutions.length === 0 ? (
                <div className="text-center py-12">
                  <p className='text-muted-foreground mb-6'>We're curating our best solutions for you. Check back soon!</p>
                </div>
              ) : filteredSolutions.length === 0 ? (
                <div className="text-center py-12">
                  <p className='text-muted-foreground mb-6'>No solutions found matching "{searchQuery}". Try a different search term.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
                  {filteredSolutions.map((solution, i) => (
                    <motion.div
                      key={solution.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <Card className="p-6 h-full flex flex-col bg-card/50 backdrop-blur hover:border-accent/30 transition-all">
                        {solution.thumbnail && solution.thumbnail[0] && (
                          <div className="mb-4 rounded-lg overflow-hidden relative group">
                            <img 
                              src={solution.thumbnail[0].url} 
                              alt={solution.solutionTitle || "Solution"}
                              className="w-full h-48 object-cover"
                            />
                            {/* Preview Button Overlay */}
                            <button
                              onClick={() => setPreviewImage({
                                url: solution.thumbnail![0].url,
                                alt: solution.solutionTitle || "Solution"
                              })}
                              className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                              aria-label="Preview image"
                            >
                              <div className="p-3 rounded-full bg-background/90 backdrop-blur border border-white/20 hover:bg-background transition-colors">
                                <Maximize2 className="w-5 h-5 text-foreground" />
                              </div>
                            </button>
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
                <Link href="/book">
                  <Button 
                    size="lg"
                    className="gold-shimmer-strong bg-accent text-accent-foreground hover:bg-accent/90"
                  >
                    <Sparkles className="mr-2" />
                    Request a Custom Build
                  </Button>
                </Link>
              </motion.div>
            </div>
          </section>
        </div>
      </div>
      <Footer />
      
      {/* Image Preview Modal */}
      {previewImage && (
        <ImagePreviewModal
          imageUrl={previewImage.url}
          alt={previewImage.alt}
          isOpen={!!previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}
