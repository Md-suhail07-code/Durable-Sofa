import { Navbar } from '@/components/Navbar'
import React, { useEffect, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ProductSearch from '@/components/ProductSearch'
import axios from 'axios'
import ProductCard from '@/components/ProductCard'
import { Loader2, FilterX } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductFilter from '@/components/ProductFilter'
import FiltersSideBar from '@/components/FiltersSideBar'

const Products = () => {
  const [productsList, setProductsList] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchValue, setSearchValue] = useState('');
  const [priceRange, setPriceRange] = useState([0, 100000]);
  const [sortBy, setSortBy] = useState("default");

  useEffect(() => {
    const getProducts = async () => {
      setIsLoading(true);
      try {
        const res = await axios.get("http://localhost:5000/api/products/get-products");
        setProductsList(res.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getProducts();
  }, []);

  useEffect(() => {
    let result = [...productsList];
    if (activeCategory !== "All") {
      result = result.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());
    }
    if (searchValue.trim() !== "") {
      const query = searchValue.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.description.toLowerCase().includes(query)
      );
    }

    result = result.filter(p => p.basePrice >= priceRange[0] && p.basePrice <= priceRange[1])

    if (sortBy === "lowToHigh") {
      result.sort((a, b) => a.basePrice - b.basePrice);
    }
    else if (sortBy === "highToLow") {
      result.sort((a, b) => b.basePrice - a.basePrice);
    }

    setFilteredProducts(result);
  }, [activeCategory, searchValue, priceRange, productsList, sortBy]);

  const viewAllProducts = () => {
    setSearchValue('');
    setActiveCategory("All");
    setPriceRange([0, 100000])
  }

  const handlePriceRange = (value) => {
    setPriceRange(value)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto px-6 py-32">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Our Collection
          </h1>
          <p className="text-muted-foreground text-base md:text-lg max-w-2xl mx-auto">
            Discover our curated selection of premium furniture pieces designed
            for comfort and elegance.
          </p>

          <div className="max-w-5xl mx-auto w-full flex flex-col md:flex-row justify-between items-center gap-4 mt-10">
            <div className="w-full md:w-auto flex-1 max-w-md">
              {/* Pass searchValue and setter to keep input in sync */}
              <ProductSearch searchValue={searchValue} setSearchValue={setSearchValue} />
            </div>
            <div className="w-full md:w-auto">
              <ProductFilter setSortBy={setSortBy} />
            </div>
          </div>
        </motion.div>

        {/* Main Body Section */}
        <div className="flex flex-col lg:flex-row gap-10">
          <aside className="w-full lg:w-64 flex-shrink-0">
            <FiltersSideBar
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              priceRange={priceRange}
              setPriceRange={handlePriceRange}
            />
          </aside>

          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20 text-primary">
                <Loader2 className="h-10 w-10 animate-spin mb-4" />
                <p className="font-medium animate-pulse text-muted-foreground">Loading collection...</p>
              </div>
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredProducts.map((product, index) => (
                    <motion.div
                      key={product._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <ProductCard product={product} index={index} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-24 bg-card rounded-3xl border border-dashed border-border">
                <FilterX className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-20" />
                <h3 className="text-2xl font-display font-bold text-foreground">No products found</h3>
                <p className="text-muted-foreground font-semibold mt-2">Try choosing a different category or search term.</p>
                <Button variant="glow" onClick={viewAllProducts} className="mt-6">
                  View All Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Products;