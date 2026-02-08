import React, { useState, useRef } from 'react';
import { motion } from "framer-motion";
import { ShoppingBag, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from 'sonner';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '@/redux/cartSlice';
import { Badge } from './ui/badge';

const ProductCard = ({ product, index }) => {
    const {
        _id,
        name,
        category,
        basePrice,
        productImages
    } = product;

    const dispatch = useDispatch();
    const {user} = useSelector((state) => state.user);

    const firstImage = productImages?.[0]?.url;
    const [isLiked, setIsLiked] = useState(false);
    const cardRef = useRef(null);
    const [transform, setTransform] = useState({ rotateX: 0, rotateY: 0 });

    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        setTransform({ rotateX, rotateY });
    };

    const handleMouseLeave = () => {
        setTransform({ rotateX: 0, rotateY: 0 });
    };

    const handleWishlist = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsLiked(!isLiked);
        if (!isLiked) {
            toast.success("Added to Wishlist");
        }
    };

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if(!user){
            return <Navigate to="/login" />
        }

        try {
            const res = await axios.post(
                'http://localhost:5000/api/cart/add-to-cart',
                { productID: _id },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
                    }
                }
            );

            if (res.data.success) {
                toast.success("Product added to cart");
                dispatch(setCart(res.data.cart));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to cart");
        }
    };


    return (
        <motion.li
            className="list-none"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
        >
            <Link to={`/product/${_id}`} className="block group no-underline">
                <div
                    ref={cardRef}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        transform: `perspective(1000px) rotateX(${transform.rotateX}deg) rotateY(${transform.rotateY}deg)`,
                        transformStyle: "preserve-3d",
                    }}
                    className="relative bg-card rounded-2xl overflow-hidden shadow-card transition-all duration-300 hover:shadow-medium border border-border/50"
                >
                    {/* Image Container */}
                    <div className="relative aspect-square overflow-hidden bg-muted">
                        <img
                            src={firstImage || '/placeholder-sofa.jpg'}
                            alt={name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                        />

                        {/* Quick Actions (Wishlist) */}
                        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 z-20">
                            <motion.button
                                whileTap={{ scale: 0.8 }}
                                onClick={handleWishlist}
                                className={`p-2 rounded-full backdrop-blur-md shadow-sm transition-colors ${isLiked
                                    ? "bg-red-500 text-white"
                                    : "bg-white/80 text-foreground hover:bg-white"
                                    }`}
                            >
                                <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
                            </motion.button>
                        </div>

                        {/* Add to Cart Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/60 to-transparent z-20">
                            <motion.div whileTap={{ scale: 0.98 }}>
                                <Button
                                    onClick={handleAddToCart}
                                    variant="glow"
                                    className="w-full font-semibold"
                                >
                                    <ShoppingBag className="h-4 w-4 mr-2" />
                                    Add to Cart
                                </Button>
                            </motion.div>
                        </div>
                    </div>

                    {/* Info Section */}
                    <div className="p-5">
                        <Badge className="mb-4 bg-primary text-white border-primary/20 hover:bg-primary/80 transition-colors uppercase tracking-[0.2em] py-1 px-4">
                            {category}
                        </Badge>
                        <h3 className="font-display text-lg font-semibold text-foreground mt-1 mb-2 line-clamp-1 group-hover:text-primary transition-colors">
                            {name}
                        </h3>
                        <div className="flex items-center justify-between">
                            <span className="flex text-xl font-display font-bold text-foreground">
                                ₹{basePrice?.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </motion.li>
    );
};

export default ProductCard;