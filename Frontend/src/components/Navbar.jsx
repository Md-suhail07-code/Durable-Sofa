import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, User, ShoppingCart, Home, Package, LogOut, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/redux/userSlice";
import { setCart } from "@/redux/cartSlice";

const navLinks = (isAuthenticated) => {
    const getHref = (path) => isAuthenticated ? path : "/login";
    return [
        { name: "Home", href: "/", icon: Home, span: false },
        { name: "Products", href: getHref("/products"), icon: Package, span: false },
        { name: "Cart", href: getHref("/cart"), icon: ShoppingCart, span: true },
        { name: "Orders", href: getHref(("/orders", isAuthenticated)), icon: ShoppingBag, span: false },
        { name: "Dashboard", href: getHref("/dashboard"), icon: LayoutDashboard, span: false }
    ];
};

export const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const location = useLocation();
    const dispatch = useDispatch();

    const userState = useSelector((state) => state.user);
    const cart = useSelector((state) => state.cart.cart);
    const isAuthenticated = !!userState.user;
    const user = userState.user || {};
    const userId = user._id;

    const handleLogout = async (e) => {
        e.preventDefault();
        setIsOpen(false);
        try {
            const res = await axios.post("http://localhost:5000/api/users/logout", {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (res.data && res.data.success) {
                dispatch(logoutUser());
                dispatch(setCart(null));
                toast.success("Logged out successfully!");
            } else {
                toast.error(res.data.message || "Logout failed at the server.");
            }
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error("Error logging out. Please refresh.", {
                description: "Client state cleared."
            });
        }
    };

    const getLinkClass = (path) => {
        const isActive = location.pathname === path;
        return `link-underline text-sm font-medium transition-colors duration-200 relative 
            ${isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            }`;
    };

    const renderProfileImage = () => {
        if (user.profilePic && !user.profilePic.includes("profile/picture/0")) {
            return (
                <img
                    src={user.profilePic}
                    alt={`${user.firstName}'s Profile`}
                    className="h-8 w-8 rounded-full object-cover border-2 border-primary group-hover:scale-105 transition-transform"
                />
            );
        }
        return (
            <Button variant="ghost" size="icon" className="hover:bg-accent/60">
                <User className="h-5 w-5 text-primary group-hover:scale-105 transition-transform" />
            </Button>
        );
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-sm border-b border-border/50 shadow-sm">
            <div className="container mx-auto px-6">
                <div className="flex items-center justify-between h-20">

                    {/* Logo and Mobile Menu Button Container (FIXED) */}
                    <div className="flex items-center w-full justify-between md:w-auto">
                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2">
                            <span className="font-display text-2xl font-semibold tracking-tight text-foreground">
                                Durable<span className="text-primary">Sofa</span>
                            </span>
                        </Link>

                        {/* Mobile Menu Button - FIXED */}
                        <button
                            className="md:hidden p-2"
                            onClick={() => setIsOpen(!isOpen)}
                            aria-label="Toggle menu"
                        >
                            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                        </button>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks(isAuthenticated).map((link) => {
                            const IconComponent = link.icon;
                            if(link.name === "Dashboard" && user.role !== "admin") return null;
                            return (
                                <Link key={link.name} to={link.href} className={getLinkClass(link.href)}>
                                    <span className="flex items-center">
                                        {link.name}
                                        <div className="flex items-center ml-1">
                                            {IconComponent && <IconComponent className="h-4 w-4" />}
                                            {link.span && (
                                                <span className="h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center ml-1">
                                                    {cart?.items?.length || 0}
                                                </span>
                                            )}
                                        </div>
                                    </span>
                                </Link>
                            );
                        })}
                    </div>

                    {/* Desktop Right Actions (Dynamic) */}
                    <div className="hidden md:flex items-center gap-4">

                        {isAuthenticated ? (
                            <div className="flex items-center gap-4">
                                <Link to={`/profile/${userId}`} className="flex items-center gap-2 group">
                                    {renderProfileImage()}

                                    <p className="text-sm font-medium text-muted-foreground hover:text-foreground hidden lg:block">
                                        Hello {user.firstName || 'User'}
                                    </p>
                                </Link>

                                {/* Logout Button */}
                                <Button variant="ghost" onClick={handleLogout} className="hover:bg-accent/60 p-2">
                                    <LogOut className="h-5 w-5 text-muted-foreground hover:text-destructive transition-colors" />
                                </Button>
                            </div>
                        ) : (
                            /* Logged Out State */
                            <Link to="/login">
                                <Button variant="glow" className="text-sm font-medium">
                                    Sign In
                                </Button>
                            </Link>
                        )}

                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="md:hidden bg-background border-b border-border shadow-md"
                    >
                        <div className="container mx-auto px-6 py-6 space-y-4">
                            {/* Mobile Links */}
                            {navLinks(isAuthenticated).map((link, index) => {
                                const IconComponent = link.icon;
                                return (
                                    <motion.div
                                        key={link.name}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                    >
                                        <Link
                                            to={link.href}
                                            className="flex items-center justify-between py-2 text-lg font-medium text-foreground hover:text-primary transition-colors"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            <span className="flex items-center gap-3 text-muted-foreground hover:text-foreground">
                                                {IconComponent && <IconComponent className="h-5 w-5 text-primary" />}
                                                {link.name}
                                            </span>

                                            {/* Mobile Badge */}
                                            {link.span && (
                                                <span className="h-6 w-6 rounded-full bg-primary text-xs font-medium text-primary-foreground flex items-center justify-center">
                                                    {cart?.items?.length || 0}
                                                </span>
                                            )}
                                        </Link>
                                    </motion.div>
                                );
                            })}

                            {/* Mobile Actions (Dynamic) */}
                            <div className="flex flex-col gap-3 pt-4 border-t border-border">
                                {isAuthenticated ? (
                                    <>
                                        <Link to={`/profile/${userId}`} onClick={() => setIsOpen(false)}>
                                            <Button variant="outline" className="w-full justify-start text-primary">
                                                <User className="mr-2 h-4 w-4" /> Go to Profile
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            onClick={handleLogout}
                                            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-red-50/20 transition-colors"
                                        >
                                            <LogOut className="mr-2 h-4 w-4" /> Logout
                                        </Button>
                                    </>
                                ) : (
                                    <Link to="/login" onClick={() => setIsOpen(false)} className="w-full">
                                        <Button variant="primary" className="w-full">
                                            Sign In
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
};