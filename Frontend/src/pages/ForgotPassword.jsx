import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import axios from 'axios'
import { CheckCircle, Loader2, Mail } from 'lucide-react'
import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState("")
    const [email, setEmail] = useState("")
    const [isSubmitted, setIsSubmitted] = useState(false)
    const navigate = useNavigate()

    const handleForgotPassword = async (e) => {
        e.preventDefault()
        // Reset error on new attempt
        setError(""); 
        
        try {
            setIsLoading(true)
            const res = await axios.post(`${API_URL}/api/users/forgotpassword`, {
                email
            });
            
            if (res.data.success) {
                setIsSubmitted(true); 
                toast.success(res.data.message || "Password reset instructions sent.");
            } else {
                setError(res.data.message || "Failed to send reset link. User may not exist.");
            }
        } catch (error) {
            setError(error.response?.data?.message || "Network error. Please try again.")
            console.error("Forgot Password Error:", error);

        } finally {
            setIsLoading(false)
        }
    }

    return (
        // Theme: Full screen background, centered content
        <div className='min-h-screen flex items-center justify-center bg-background p-4'>
            <div className='w-full max-w-md space-y-6'>
                <div className='text-center space-y-2'>
                    <h1 className='font-display text-3xl font-bold tracking-tight text-foreground'>
                        Reset Your Password
                    </h1>
                    <p className='text-muted-foreground'>
                        Enter your email address to receive instructions.
                    </p>
                </div>

                <Card className='w-full bg-card border-border shadow-medium'>
                    <CardHeader className='space-y-1'>
                        <CardTitle className='font-display text-2xl text-center text-primary'>
                            Forgot Password
                        </CardTitle>
                        <CardDescription className='text-center text-muted-foreground'>
                            {
                                isSubmitted ? "Check your inbox for reset instructions"
                                    : "Enter your email address to receive a password reset link."
                            }
                        </CardDescription>
                    </CardHeader>

                    <CardContent className='space-y-4'>
                        {/* Error Alert */}
                        {
                            error && (
                                <Alert variant="destructive">
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )
                        }

                        {/* Submission Success Screen */}
                        {
                            isSubmitted ? (
                                <div className='py-6 flex flex-col items-center justify-center text-center space-y-4'>
                                    <div className='bg-primary/10 rounded-full p-3'>
                                        <CheckCircle className='h-6 w-6 text-primary' />
                                    </div>
                                    <div className='space-y-2'>
                                        <h3 className='font-display font-medium text-lg text-foreground'>Check your inbox</h3>
                                        <p className='text-muted-foreground'>We've sent a password reset link to <span className='font-medium text-primary'>{email}</span></p>
                                        <p className='text-sm text-muted-foreground'>
                                            If you don't see the email, check your spam folder or{" "}
                                            <button
                                                className='text-primary hover:underline font-medium'
                                                onClick={() => {
                                                    setIsSubmitted(false);
                                                    setError(""); // Allow user to try again
                                                }}
                                                disabled={isLoading}
                                            >
                                                try again
                                            </button>
                                        </p>
                                    </div>
                                    {/* Optional: Add a button to proceed to the OTP verification page if your flow requires it */}
                                    <Link to={`/verify-otp/${email}`}>
                                        <Button variant="glow" className="mt-4">
                                            Verify OTP
                                        </Button>
                                    </Link>
                                </div>
                            ) : (
                                // Form Input Screen
                                <form onSubmit={handleForgotPassword} className='space-y-6'>
                                    <div className='space-y-2 relative'>
                                        <Label htmlFor="email" className='text-foreground'>Email</Label>
                                        <Input
                                            id="email"
                                            type='email'
                                            placeholder="Enter your email address"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            disabled={isLoading}
                                            // Theme consistency for inputs
                                            className="bg-input/50 border-border text-foreground placeholder:text-muted-foreground focus-visible:ring-ring"
                                        />
                                    </div>
                                    <Button
                                        type="submit"
                                        className="w-full bg-primary text-primary-foreground relative hover:bg-primary/90"
                                        disabled={isLoading}
                                        variant="glow"
                                    >
                                        {
                                            isLoading ? (
                                                <>
                                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                    Sending Link...
                                                </>
                                            ) : ("Send Reset Link")
                                        }
                                    </Button>
                                </form>
                            )
                        }
                    </CardContent>
                    
                    {/* Footer Link */}
                    <CardFooter className='flex justify-center'>
                        <p className='text-muted-foreground'>
                            Remember your password?{" "}
                            <Link to={'/login'} className='text-primary hover:underline font-medium relative'>
                                Sign in
                            </Link>
                        </p>
                    </CardFooter>
                </Card>
            </div>
        </div>
    )
}

export default ForgotPassword