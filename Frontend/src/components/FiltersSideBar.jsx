import React from 'react'
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { motion } from 'framer-motion';
import { Filter, RotateCcw } from 'lucide-react';
import { Slider } from './ui/slider';

const FiltersSideBar = ({ activeCategory, setActiveCategory, priceRange, setPriceRange }) => {
    const categories = ["Sofa", "Headboard", "Mattress", "Pillow"];

    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="w-full lg:w-64 bg-card border border-border rounded-2xl p-6 sticky top-28 h-fit shadow-sm"
        >
            <div className="flex items-center gap-2 mb-6">
                <Filter className="w-5 h-5 text-primary" />
                <h2 className="font-display text-xl font-semibold text-foreground">Filters</h2>
            </div>

            <div className="space-y-6">
                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                        Category
                    </h3>
                    <div className="space-y-3">
                        {/* "All" Option */}
                        <div
                            className="flex items-center space-x-3 group cursor-pointer"
                            onClick={() => setActiveCategory("All")}
                        >
                            <input
                                type="radio"
                                name="category"
                                checked={activeCategory === "All"}
                                readOnly
                                className="h-4 w-4 accent-primary cursor-pointer"
                            />
                            <Label className={`text-sm cursor-pointer transition-colors ${activeCategory === "All" ? "text-primary font-bold" : "text-muted-foreground"}`}>
                                All Collections
                            </Label>
                        </div>

                        {categories.map((cat) => (
                            <div
                                key={cat}
                                className="flex items-center space-x-3 group cursor-pointer"
                                onClick={() => setActiveCategory(cat)}
                            >
                                <input
                                    type="radio"
                                    name="category"
                                    checked={activeCategory === cat}
                                    readOnly
                                    className="h-4 w-4 accent-primary cursor-pointer"
                                />
                                <Label className={`text-sm cursor-pointer transition-colors ${activeCategory === cat ? "text-primary font-bold" : "text-muted-foreground"}`}>
                                    {cat}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator className="bg-border/50" />

                <div>
                    <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4">
                        Price Range
                    </h3>
                    <div className="px-1">
                        <Slider
                            value={[priceRange[0], priceRange[1]]}
                            onValueChange={setPriceRange}
                            max={100000}
                            min={0}
                            step={50}
                            className="mb-3"
                        />
                        <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>₹{priceRange[0]}</span>
                            <span>₹{priceRange[1]}</span>
                        </div>
                    </div>
                </div>

                <Separator className="bg-border/50" />

                <button
                    onClick={() => setActiveCategory("All")}
                    className="flex items-center justify-center gap-2 w-full py-2 text-xs font-semibold text-primary hover:bg-primary/10 rounded-lg transition-colors border border-primary/20"
                >
                    <RotateCcw className="w-3 h-3" />
                    Reset Filters
                </button>
            </div>
        </motion.div>
    )
}

export default FiltersSideBar