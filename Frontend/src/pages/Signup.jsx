import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import loginBg from "@/assets/login-bg.jpg";
import axios from "axios";
import { toast } from "sonner";
import { API_URL } from "@/config";

const VerificationSentMessage = ({ email }) => (
    <div className="w-full flex items-center justify-center p-6 sm:p-12 bg-background border border-border">
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-md text-center p-8 sm:p-12 bg-card rounded-xl shadow-card"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
            >
                <Mail
                    className="h-14 w-14 sm:h-16 sm:w-16 text-primary mx-auto mb-6 drop-shadow-sm" 
                />
            </motion.div>
            
            <h1 className="font-display text-3xl font-semibold text-foreground mb-4">
                Verify Your Email
            </h1>
            
            <p className="text-muted-foreground mb-6">
                An email has been sent to <span className="font-semibold text-primary">{email}</span>. Please click the verification link inside the email to activate your account.
            </p>
            
            <p className="text-sm text-muted-foreground mb-8">
                You may close this window or proceed to the login page once verified.
            </p>
            
            <Link to="/login">
                <Button variant="glow" size="lg" className="w-full">
                    Go to Login
                </Button>
            </Link>
        </motion.div>
    </div>
);


const Signup = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [verificationSent, setVerificationSent] = useState(false);
    
    // Using a single formData state is correct
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    }

    const handleSignup = async (e) => {
        e.preventDefault();
        setError(null);
        setIsLoading(true);

        try {
            const res = await axios.post(`${API_URL}/api/users/register`, formData, {
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            if (res.data.success) {
                setVerificationSent(true);
                toast.success(res.data.message || "Account created! Check your email for verification.");
            } else {
                // If API returns success: false
                const errorMessage = res.data.message || "Signup failed. Please verify your input.";
                setError(errorMessage);
                toast.error(errorMessage);
            }

        } catch (error) {
            console.error("Signup API Error:", error);
            // Handling Axios network or server error response
            const errorMessage = error.response?.data?.message || "An unexpected error occurred. Please try again.";
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image (Desktop) */}
            <div className="hidden lg:flex lg:w-1/2 relative">
                <img
                    src={loginBg}
                    alt="Luxurious living room with modern sofa"
                    className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-charcoal/40" />
                <div className="relative z-10 flex flex-col justify-between p-12 w-full">
                    <Link to="/" className="inline-block">
                        <span className="font-display text-2xl font-semibold text-primary-foreground">
                            Durable<span className="text-primary">Sofa</span>
                        </span>
                    </Link>
                    <div className="max-w-md">
                        <motion.h2
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="font-display text-4xl font-semibold text-primary-foreground mb-4"
                        >
                            Elevate Your Living Space
                        </motion.h2>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-primary-foreground/80"
                        >
                            Join thousands of design enthusiasts who have transformed their homes
                            with our curated collection of luxury furniture.
                        </motion.p>
                    </div>
                </div>
            </div>

            {/* Right Side - Form / Verification Message */}
            <div className="w-full lg:w-1/2 flex items-center justify-center"> 
                {
                    verificationSent ? (
                        <VerificationSentMessage email={formData.email} />
                    ) : (
                        <div className="w-full flex items-center justify-center p-6 sm:p-12 bg-background border border-border">
                            <motion.div
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                                className="w-full max-w-md"
                            >
                                {/* Mobile Logo */}
                                <Link to="/" className="lg:hidden inline-block mb-8">
                                    <span className="font-display text-2xl font-semibold text-foreground">
                                        Durable<span className="text-primary">Sofa</span>
                                    </span>
                                </Link>

                                {/* Header */}
                                <div className="mb-8">
                                    <h1 className="font-display text-3xl font-semibold text-foreground mb-2">
                                        Create account
                                    </h1>
                                    <p className="text-muted-foreground">
                                        Fill in the details to get started
                                    </p>
                                    {error && <p className="text-sm text-destructive mt-2">{error}</p>}
                                </div>

                                {/* Form */}
                                <form onSubmit={handleSignup} className="space-y-5">
                                    
                                    {/* First Name & Last Name Fields */}
                                    <div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
                                                    First Name
                                                </label>
                                                <Input
                                                    id="firstName"
                                                    name="firstName"
                                                    type="text"
                                                    placeholder="First Name"
                                                    value={formData.firstName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                            <div className="grid gap-2">
                                                <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
                                                    Last Name
                                                </label>
                                                <Input
                                                    id="lastName"
                                                    name="lastName"
                                                    type="text"
                                                    placeholder="Last Name"
                                                    value={formData.lastName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Email Address */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Email Address
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                name="email"
                                                type="email"
                                                placeholder="you@example.com"
                                                className="pl-11"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div>
                                        <label className="block text-sm font-medium text-foreground mb-2">
                                            Password
                                        </label>
                                        <div className="relative">
                                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                name="password"
                                                type={showPassword ? "text" : "password"}
                                                placeholder="••••••••"
                                                className="pl-11 pr-11"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </button>
                                        </div>
                                    </div>

                                    <motion.div whileTap={{ scale: 0.98 }}>
                                        <Button
                                            type="submit"
                                            variant="glow"
                                            size="lg"
                                            className="w-full group"
                                            disabled={isLoading}
                                        >
                                            {isLoading ? 'Creating Account...' : 'Create Account'}
                                            {!isLoading && <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />}
                                        </Button>
                                    </motion.div>
                                </form>

                                {/* Divider */}
                                <div className="relative my-8">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="px-4 bg-background text-muted-foreground">
                                            or continue with
                                        </span>
                                    </div>
                                </div>

                                {/* Social Login */}
                                <div className="grid grid-cols-1 gap-4">
                                    <Button variant="outline" onClick={() => window.open(`${API_URL}/auth/google`, "_self")} className="h-12">
                                        <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                            <path
                                                fill="currentColor"
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                            />
                                            <path
                                                fill="currentColor"
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                            />
                                        </svg>
                                        Google
                                    </Button>
                                </div>

                                {/* Toggle to Login */}
                                <p className="text-center mt-8 text-muted-foreground">
                                    Already have an account?{" "}
                                    <Link
                                        to="/login" // Link to the login page
                                        className="text-primary font-medium hover:text-primary/80 transition-colors"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </motion.div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Signup;