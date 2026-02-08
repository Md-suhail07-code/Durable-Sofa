import React from 'react'
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Input } from './ui/input';

const ProductSearch = ({ searchValue, setSearchValue }) => {
  return (
    <div className="relative w-full max-w-md">
      <motion.div
        className="relative flex items-center bg-card border border-border rounded-xl overflow-hidden transition-colors hover:border-primary/50"
      >
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search Products..."
          className="w-full py-6 pl-12 pr-12 bg-transparent text-foreground placeholder:text-muted-foreground border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="absolute right-3 flex items-center gap-2">
          <AnimatePresence>
            {searchValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchValue("")}
                className="p-1 hover:bg-muted rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
          <kbd className="hidden md:flex items-center gap-1 px-2 py-1 text-[10px] text-muted-foreground bg-muted rounded border border-border">
            <span>ESC</span>
          </kbd>
        </div>
      </motion.div>
    </div>
  )
}

export default ProductSearch;