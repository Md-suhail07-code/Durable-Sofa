import { motion } from "framer-motion";
import sofaImage from "@/assets/sofa-product.jpg";
import headboardImage from "@/assets/headboard.jpg";
import mattressImage from "@/assets/mattress.jpg";
import pillowsImage from "@/assets/pillows.jpg";
import { Link } from "react-router-dom";

const categories = [
    {
        name: "Sofas",
        description: "Luxury sectionals & loveseats",
        image: sofaImage,
    },
    {
        name: "Headboards",
        description: "Upholstered elegance",
        image: headboardImage,
    },
    {
        name: "Mattresses",
        description: "Premium sleep comfort",
        isNew: true, // Example of adding a new prop
        image: mattressImage,
    },
    {
        name: "Pillows",
        description: "Soft decorative accents",
        image: pillowsImage,
    },
];

const CategoryCard = ({ category }) => {
    return (
        <motion.div whileHover={{ y: -8 }} className="group mb-4 relative flex-shrink-0 w-72 md:w-80 h-96 rounded-2xl overflow-hidden cursor-pointer mx-3 shadow-medium">
            {/* Image */}
            <img
                src={category.image}
                alt={category.name}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-90 transition-opacity duration-300" />

            {/* Content */}
            <div className="absolute bottom-0 left-0 right-0 p-6 transform transition-transform duration-300">
                <h3 className="font-display text-2xl font-semibold text-primary-foreground mb-1">
                    {category.name}
                </h3>
                <p className="text-sm text-primary-foreground/70 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {category.description}
                </p>
                <Link to="/products" className="no-underline">
                    <div className="mt-4 flex items-center gap-2 text-primary-foreground/90 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 delay-75">
                        <span className="text-sm font-medium">Explore</span>
                        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                    </div>
                </Link>
            </div>
        </motion.div>
    );
};

export const CategoryMarquee = () => {
    // Double the categories for seamless loop
    const allCategories = [...categories];

    return (
        <section className="py-20 overflow-hidden bg-muted/30">
            <div className="container mx-auto px-6 mb-12">
                <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }} className="text-center">
                    <span className="text-sm font-medium tracking-widest uppercase text-primary mb-4 block"> Our Collections </span>
                    <h2 className="font-display text-4xl md:text-5xl font-semibold text-foreground"> Shop by Category </h2>
                </motion.div>
            </div>
            {/* Marquee */}
            <div className="relative">
                <div className="flex flex-col items-center mb-4 lg:flex-row justify-center marquee">
                    {allCategories.map((category, index) => (
                        <CategoryCard
                            key={`${category.name}-${index}`}
                            category={category}
                        />
                    ))}
                </div>
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-muted/30 to-transparent pointer-events-none" />
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-muted/30 to-transparent pointer-events-none" />
            </div>
        </section>
    );
};