import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { Loader2, Lock, CheckCircle, Eye, EyeOff } from 'lucide-react' // Added Eye and EyeOff icons
import React, { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { API_URL } from "@/config";

const ChangePassword = () => {
    const { email } = useParams()
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    
    // 🌟 ADDED STATE FOR PASSWORD VISIBILITY 🌟
    const [showPassword, setShowPassword] = useState(false) 
    
    const navigate = useNavigate()

    const handleChangePassword = async () => {
        setError("")
        setSuccess("")

        if (!newPassword || !confirmPassword) {
            setError("Please fill in all fields.")
            return
        }

        if (newPassword !== confirmPassword) {
            setError("Passwords do not match.")
            return
        }

        try {
            setIsLoading(true)
            // Using placeholder URL from previous context
            const res = await axios.post(`${API_URL}/api/users/changepassword/${email}`, {
                newPassword,
                confirmPassword
            })

            setSuccess(res.data.message || "Password updated successfully!")
            
            // Redirect to login after success
            setTimeout(() => {
                navigate('/login')
            }, 2000)

        } catch (error) {
            setError(error.response?.data?.message || "Failed to change password. Please try again.")
        } finally {
            setIsLoading(false)
        }
    }
    
    const showSuccessScreen = success && !error;

    return (
        // Theme: Full screen background, elegant padding
        <div className='min-h-screen flex items-center justify-center bg-background px-4'>
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                // Theme: Use bg-card and shadow-medium for professional look
                className='bg-card border border-border shadow-medium rounded-xl p-8 max-w-md w-full'
            >
                {showSuccessScreen ? (
                    // --- SUCCESS SCREEN ---
                    <div className='text-center py-8 space-y-4'>
                        <CheckCircle className='h-16 w-16 text-primary mx-auto' />
                        <h2 className='font-display text-3xl font-semibold text-foreground'>
                            Success!
                        </h2>
                        <p className='text-muted-foreground mb-4'>{success}</p>
                        <p className='text-sm text-primary'>Redirecting to login...</p>
                    </div>
                ) : (
                    // --- CHANGE PASSWORD FORM ---
                    <>
                        <div className='text-center space-y-2 mb-6'>
                            <Lock className='h-8 w-8 text-primary mx-auto' />
                            <h2 className='font-display text-3xl font-semibold text-primary'>Change Password</h2>
                            <p className='text-muted-foreground text-sm'>
                                Set a new password for <span className='font-semibold text-foreground'>{email}</span>
                            </p>
                        </div>
                        
                        {/* Error Messages */}
                        {error && (
                            <div className='text-sm text-destructive bg-destructive/10 border border-destructive rounded-md p-2 mb-4 text-center'>
                                {error}
                            </div>
                        )}

                        <div className='space-y-4'>
                            
                            {/* 1. New Password Input Field */}
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"} // Dynamic type
                                    placeholder="New Password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring pr-10" // Add right padding
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            
                            {/* 2. Confirm Password Input Field */}
                            <div className="relative">
                                <Input
                                    type={showPassword ? "text" : "password"} // Dynamic type
                                    placeholder="Confirm Password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-input border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring pr-10" // Add right padding
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </button>
                            </div>
                            
                            {/* Primary Button (Glow Variant) */}
                            <Button
                                type="button" // Change type to button as it uses onClick handler
                                className='w-full font-semibold transition-colors'
                                disabled={isLoading}
                                onClick={handleChangePassword}
                                variant="glow" // Use the attractive glow variant
                            >
                                {
                                    isLoading ? (
                                        <>
                                            <Loader2 className='mr-2 w-4 h-4 animate-spin' /> Changing Password
                                        </>
                                    ) : "Change Password"
                                }
                            </Button>
                        </div>
                    </>
                )}
            </motion.div>
        </div>
    )
}

export default ChangePassword