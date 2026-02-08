import React from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import axios from 'axios';
import { Loader2, CheckCircle, XCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";

const EmailVerify = () => {
    const [status, setStatus] = React.useState('Verifying your email address...');
    const [isSuccess, setIsSuccess] = React.useState(false);
    const [isError, setIsError] = React.useState(false);
    
    const { token } = useParams();
    const navigate = useNavigate();

    React.useEffect(() => {
        if (!token) {
            setStatus("❌ Missing verification token.");
            setIsError(true);
            setTimeout(() => navigate('/signup'), 2000);
            return;
        }

        const verifyEmail = async () => {
            try {
                const res = await axios.post(`http://localhost:5000/api/users/verify`, {}, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                if (res.data.success) {
                    setStatus("✅ Email Verified Successfully!");
                    setIsSuccess(true);
                    toast.success("Verification successful! Please log in.");
                    
                    // Redirect after 2 seconds
                    setTimeout(() => {
                        navigate('/login');
                    }, 2000); 

                } else {
                    setStatus("❌ Invalid or Expired Token.");
                    setIsError(true);
                    toast.error(res.data.message || "Invalid or Expired Token.");
                }
            } catch (error) {
                console.error("Verification Error:", error);
                const errorMessage = error.response?.data?.message || 'Verification failed due to a network error.';
                
                toast.error(errorMessage);
                setStatus('Verification failed.');
                setIsError(true);
            }
        };

        verifyEmail();
    }, [token, navigate]);

    const IconComponent = isSuccess ? CheckCircle : (isError ? XCircle : Loader2);
    const iconClass = isSuccess ? 'text-primary' : (isError ? 'text-destructive' : 'text-primary animate-spin');

    return (
        <div className="min-h-screen flex items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-lg text-center p-8 sm:p-12 bg-card rounded-xl shadow-medium border border-border"
            >
                {/* Icon Container */}
                <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100 }}
                    className="mb-6 mx-auto"
                >
                    <IconComponent className={`h-16 w-16 mx-auto ${iconClass}`} />
                </motion.div>

                {/* Status Header */}
                <h1 className="font-display text-3xl font-semibold text-foreground mb-4">
                    {isSuccess ? 'Verification Complete' : (isError ? 'Verification Failed' : 'Please Wait')}
                </h1>
                
                {/* Status Message */}
                <p className={`text-lg mb-8 ${isError ? 'text-destructive' : 'text-muted-foreground'}`}>
                    {status}
                </p>
                
                {/* Action Button (Visible on Success or Error) */}
                {(isSuccess || isError) && (
                    <Link to="/login">
                        <Button 
                            variant={isSuccess ? "glow" : "outline"} 
                            size="lg" 
                            className="w-full max-w-xs mx-auto"
                        >
                            {isSuccess ? 'Go to Login' : 'Try Signup Again'}
                        </Button>
                    </Link>
                )}

            </motion.div>
        </div>
    );
}

export default EmailVerify;