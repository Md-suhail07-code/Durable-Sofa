import { motion } from "framer-motion";
import { CheckCircle, Zap, DollarSign, Shield, Handshake } from "lucide-react";

// Data representing your value propositions
const features = [
    {
        name: "Quality Guarantee",
        description: "We give 100% guarantee about our product for its long life and durability. Shop with confidence.",
        icon: Shield,
        color: "text-primary",
        bg: "bg-primary/10"
    },
    {
        name: "High Quality Materials",
        description: "We use premium, high-quality products to provide maximum long-life, comfort, and luxurious feel.",
        icon: CheckCircle,
        color: "text-primary", // Using a custom indigo equivalent for contrast
        bg: "bg-primary/10"
    },
    {
        name: "Best Value Pricing",
        description: "Our products offer the best quality-to-price ratio in the market for ultimate customer satisfaction.",
        icon: DollarSign,
        color: "text-primary", // Using a custom yellow equivalent for contrast
        bg: "bg-primary/10"
    },
];

const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

export const WhyChooseUs = () => {
    return (
        <section id="wcu-section" className="py-20 lg:py-28 bg-background">
            <div className="container mx-auto px-6 max-w-7xl">
                
                {/* Header */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-16"
                >
                    <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
                        Why Choose Us?
                    </h1>
                    <p className="text-muted-foreground text-lg max-w-3xl mx-auto">
                        We are committed to crafting furniture that lasts, using only the best materials for customer satisfaction and product longevity.
                    </p>
                </motion.div>

                {/* Cards Grid */}
                <motion.div 
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ staggerChildren: 0.2 }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                >
                    {features.map((feature, index) => (
                        <motion.div 
                            key={feature.name}
                            variants={cardVariants}
                            // Added elegance and hover effect
                            className="w-full bg-card p-8 rounded-xl shadow-card border border-border/50 transition-all duration-300 hover:shadow-xl hover:scale-[1.02]"
                        >
                            <div className={`p-4 rounded-full w-max mb-6 ${feature.bg}`}>
                                <feature.icon className={`h-8 w-8 ${feature.color}`} />
                            </div>
                            
                            <h2 className="font-display text-2xl font-semibold text-foreground mb-3">
                                {feature.name}
                            </h2>
                            <p className="text-muted-foreground">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

            </div>
        </section>
    );
};