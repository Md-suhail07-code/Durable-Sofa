import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import NotFoundImage from '@/assets/NOT-FOUND.jpg';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-[120px]" />
      </div>

      <div className="container max-w-2xl text-center z-10">
        {/* Animated Image Container */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative mb-8"
        >
          <img 
            src={NotFoundImage}
            alt="404 Page Not Found" 
            className="w-full max-w-md mx-auto drop-shadow-2xl"
          />
        </motion.div>

        {/* Text Content */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4">
            Lost in the Showroom?
          </h1>
          <p className="text-muted-foreground text-lg mb-10 max-w-md mx-auto leading-relaxed">
            We couldn't find the piece you're looking for. It might have been moved or is no longer in our collection.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/">
              <Button size="lg" className="h-12 px-8 rounded-full shadow-lg hover:shadow-primary/20 transition-all">
                <Home className="mr-2 h-5 w-5" />
                Back to Home
              </Button>
            </Link>
            
            <Link to="/products">
              <Button variant="outline" size="lg" className="h-12 px-8 rounded-full border-border hover:bg-muted transition-all">
                <ShoppingBag className="mr-2 h-5 w-5" />
                Browse Collection
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Support Footer */}
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ delay: 0.8 }}
          className="mt-16 text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium"
        >
          DurableSofa Co. — Excellence in Comfort
        </motion.p>
      </div>
    </div>
  );
};

export default NotFound;