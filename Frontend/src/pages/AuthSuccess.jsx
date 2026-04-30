import React, { useEffect, useState } from 'react'; // Import useState
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion'; // Import motion
import { Loader2, CheckCircle } from 'lucide-react'; // Import icons
import { setUser } from '@/redux/userSlice';
import { toast } from 'sonner';
import { API_URL } from '@/config'; // Use toast for feedback

const AuthSuccess = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    
    // State to manage UI feedback
    const [loadingStatus, setLoadingStatus] = useState('Authenticating...');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        const handleAuth = async () => {
            const params = new URLSearchParams(window.location.search);
            const accessToken = params.get('token');

            if (accessToken) {
                localStorage.setItem('accessToken', accessToken);
                setLoadingStatus('Fetching user profile...');
                
                try {
                    const res = await axios.get(`${API_URL}/auth/me`, {
                        headers: {
                            Authorization: `Bearer ${accessToken}`
                        }
                    });

                    if (res.data.success && res.data.user) {
                        dispatch(setUser(res.data.user));
                        
                        setLoadingStatus('Authentication successful! Redirecting...');
                        setIsSuccess(true);

                        // Give success message time to display before redirect
                        toast.success("Login successful! Welcome.");
                        setTimeout(() => {
                            navigate('/');
                        }, 1000); 

                    } else {
                        // Handle case where token is present but user fetch failed
                        toast.error("Authentication failed. Please try logging in again.");
                        navigate('/login');
                    }
                } catch (error) {
                    console.error('Error fetching user data:', error);
                    toast.error("Network error. Failed to load user data.", {
                        description: "Please check your network and try again."
                    });
                    navigate('/login');
                }
            } else {
                // If no token is found in the URL params
                window.location.href = '/login';
            }
        };

        handleAuth();
    }, [navigate, dispatch]);

    return (
        // Full screen, centered container consistent with login/signup pages
        <div className="min-h-screen flex items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-sm text-center p-8 bg-card rounded-xl shadow-medium border border-border"
            >
                {/* Dynamic Icon */}
                <motion.div
                    animate={isSuccess ? { scale: 1 } : { rotate: 360 }}
                    transition={isSuccess ? { duration: 0.3 } : { duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="mb-4 mx-auto"
                >
                    {isSuccess ? (
                        <CheckCircle className="h-16 w-16 text-primary mx-auto" />
                    ) : (
                        <Loader2 className="h-16 w-16 text-primary mx-auto" />
                    )}
                </motion.div>

                <h1 className="font-display text-2xl font-semibold text-foreground mb-2">
                    {isSuccess ? 'Success!' : 'Authenticating...'}
                </h1>
                
                <p className="text-muted-foreground text-sm">
                    {loadingStatus}
                </p>
                
                {/* Optional: Add a subtle loading bar for visual appeal */}
                {!isSuccess && (
                    <div className="h-1 bg-muted rounded-full overflow-hidden mt-4">
                        <motion.div
                            initial={{ width: '0%' }}
                            animate={{ width: ['0%', '100%'] }}
                            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                            className="h-full bg-primary"
                        />
                    </div>
                )}
            </motion.div>
        </div>
    );
}

export default AuthSuccess;