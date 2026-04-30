import { Navbar } from '@/components/Navbar';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Loader2, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import TechnicalSpecs from '@/components/TechnicalSpecs';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setCart } from '@/redux/cartSlice';
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { API_URL } from '@/config'

const ProductDetails = () => {
    const { _id } = useParams();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.user);

    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);
    const [product, setProduct] = useState(null);
    const [selectedImage, setSelectedImage] = useState(0);

    const getProduct = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${API_URL}/api/products/getProduct/${_id}`);
            setProduct(res.data.prod);
        } catch (error) {
            console.error("Error fetching product:", error);
            toast.error("Could not load product details");
        } finally {
            setLoading(false);
        }
    };

    const handleAddToCart = async () => {
        if (!user) {
            return <Navigate to="/login" />
        }
        const token = localStorage.getItem("accessToken");
        if (!token) {
            return toast.error("Please login to add items to cart");
        }

        try {
            setAddingToCart(true);
            const res = await axios.post(
                `${API_URL}/api/cart/add-to-cart`,
                { productID: _id },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.success) {
                toast.success("Product added to cart");
                dispatch(setCart(res.data.cart));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add to cart");
        } finally {
            setAddingToCart(false);
        }
    }

    useEffect(() => {
        getProduct();
        window.scrollTo(0, 0);
    }, [_id]);

    const nextImage = () => {
        if (!product?.productImages) return;
        setSelectedImage((prev) => (prev === product.productImages.length - 1 ? 0 : prev + 1));
    };

    const prevImage = () => {
        if (!product?.productImages) return;
        setSelectedImage((prev) => (prev === 0 ? product.productImages.length - 1 : prev - 1));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
                <Loader2 className="w-12 h-12 animate-spin text-primary" />
                <p className="text-muted-foreground animate-pulse">Loading luxury details...</p>
            </div>
        );
    }

    if (!product) return <div className="text-center py-20">Product not found.</div>;

    const { name, category, description, basePrice, productImages } = product;

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="container mx-auto px-6 pt-32 pb-20">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                    {/* LEFT COLUMN: IMAGE GALLERY */}
                    <div className="space-y-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative aspect-square rounded-3xl overflow-hidden bg-card border border-border shadow-soft"
                        >
                            <AnimatePresence mode="wait">
                                <Zoom>
                                    <motion.img
                                        key={selectedImage}
                                        src={productImages?.[selectedImage]?.url || '/placeholder.jpg'}
                                        alt={name}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className="w-full h-full object-cover"
                                    />
                                </Zoom>
                            </AnimatePresence>

                            {productImages?.length > 1 && (
                                <div className="absolute inset-0 flex items-center justify-between px-4 pointer-events-none">
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={prevImage}
                                        className="rounded-full bg-background/60 backdrop-blur-md pointer-events-auto shadow-lg"
                                    >
                                        <ChevronLeft className="w-6 h-6" />
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        onClick={nextImage}
                                        className="rounded-full bg-background/60 backdrop-blur-md pointer-events-auto shadow-lg"
                                    >
                                        <ChevronRight className="w-6 h-6" />
                                    </Button>
                                </div>
                            )}
                        </motion.div>

                        <div className="flex gap-4 overflow-x-auto py-2 no-scrollbar justify-center">
                            {productImages?.map((img, idx) => (
                                <button
                                    key={img._id || idx}
                                    onClick={() => setSelectedImage(idx)}
                                    className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${selectedImage === idx ? "border-primary scale-110 shadow-medium" : "border-transparent opacity-50"
                                        }`}
                                >
                                    <Zoom>
                                        <img src={img.url} className="w-full h-full object-cover" alt="thumbnail" />
                                    </Zoom>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* RIGHT COLUMN: PRODUCT INFO */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex flex-col space-y-8"
                    >
                        <div>
                            <Badge className="mb-4 bg-primary text-white border-primary/20 hover:bg-primary/80 transition-colors uppercase tracking-[0.2em] py-1 px-4">
                                {category}
                            </Badge>
                            <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                                {name}
                            </h1>
                            <div className="flex items-baseline gap-4 mt-6">
                                <p className="text-4xl font-display font-bold text-primary">
                                    ₹{basePrice?.toLocaleString('en-IN')}
                                </p>
                                <span className="text-sm text-muted-foreground uppercase tracking-widest font-medium">Incl. all taxes</span>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Description</h3>
                            <p className="text-muted-foreground text-lg leading-relaxed border-l-2 border-primary/30 pl-6 py-1">
                                {description}
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-6">
                            <Button
                                onClick={handleAddToCart}
                                variant="glow"
                                size="lg"
                                disabled={addingToCart}
                                className="flex-1 h-16 text-lg gap-3 font-semibold"
                            >
                                {addingToCart ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <ShoppingCart className="w-5 h-5" />
                                )}
                                {addingToCart ? "Adding..." : "Add to Cart"}
                            </Button>
                            <Button variant="outline" size="lg" className="flex-1 h-16 text-lg font-semibold hover:bg-accent transition-all">
                                Buy Now
                            </Button>
                        </div>

                        <TechnicalSpecs materials={product.materials} dimensions={product.dimensions} />
                    </motion.div>
                </div>
            </main>
        </div>
    );
};

export default ProductDetails;