import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import axios from 'axios'
import { CheckCircle, Loader2, RotateCcw, Mail } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { API_URL } from "@/config";

const VerifyOTP = () => {
    const [isVerified, setIsVerified] = useState(false)
    const [error, setError] = useState("")
    const [successMessage, setSuccessMessage] = useState("")
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [isLoading, setIsLoading] = useState(false)
    const inputRefs = useRef([])
    const { email } = useParams()
    const navigate = useNavigate()


    const handleChange = (index, value) => {
        // Allow deletion (backspace) without advancing
        if (value === "") {
            const updatedOtp = [...otp];
            updatedOtp[index] = value;
            setOtp(updatedOtp);
            // Move focus backward on backspace
            if (index > 0) {
                inputRefs.current[index - 1]?.focus();
            }
            return;
        }

        if (value.length > 1) return
        const updatedOtp = [...otp]
        updatedOtp[index] = value
        setOtp(updatedOtp)
        
        // Move focus forward
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus()
        }
    }

    const handleVerify = async () => {
        const finalOtp = otp.join("")
        if (finalOtp.length !== 6) {
            setError("Please enter all 6 digits")
            return
        }

        try {
            setIsLoading(true)
            // Using placeholder URL from previous context
            
            const res = await axios.post(`${API_URL}/api/users/verifyotp/${email}`, {
                otp: finalOtp,
            })
            setSuccessMessage(res.data.message || "Verification successful!")
            setIsVerified(true)
            setTimeout(() => {
                navigate(`/changepassword/${email}`)
            }, 2000)
        } catch (error) {
            setError(error.response?.data?.message || "Invalid or expired code.")
        } finally {
            setIsLoading(false)
        }
    }

    const clearOtp = () => {
        setOtp(["", "", "", "", "", ""])
        setError("")
        inputRefs.current[0]?.focus()
    }

    return (
        // 1. Theme: Use bg-background for consistency
        <div className='min-h-screen flex flex-col bg-background'>
            {/* Main content */}
            <div className='flex-1 flex items-center justify-center p-4'>
                <div className='w-full max-w-md space-y-6'>
                    <div className='text-center space-y-2'>
                        {/* Use text-foreground and font-display */}
                        <Mail className="h-10 w-10 text-primary mx-auto mb-2" />
                        <h1 className='font-display text-3xl font-bold tracking-tight text-foreground'>Verify Your Email</h1>
                        {/* Light Text */}
                        <p className='text-muted-foreground'>We've sent a 6-digit verification code to{" "}
                            <span className="text-primary font-semibold">{email}</span>
                        </p>
                    </div>
                    
                    {/* Card: Theme styling */}
                    <Card className='shadow-medium bg-card border-border text-foreground'>
                        <CardHeader className='space-y-1'>
                            <CardTitle className='font-display text-2xl text-center text-primary'>Enter Code</CardTitle>
                            <CardDescription className='text-center text-muted-foreground'>
                                {
                                    isVerified
                                        ? "Code verified successfully! Redirecting..."
                                        : "Enter the 6-digit code sent to your email"
                                }
                            </CardDescription>
                        </CardHeader>
                        <CardContent className='space-y-6'>
                            {/* Error Alert */}
                            {
                                error && (
                                    <Alert variant="destructive" className="bg-destructive/10 border-destructive text-destructive">
                                        <AlertDescription>{error}</AlertDescription>
                                    </Alert>
                                )
                            }
                            {successMessage && <p className='text-primary text-sm mb-3 text-center'>{successMessage}</p>}
                            {
                                isVerified ? (
                                    // Success screen styling
                                    <div className='py-6 flex flex-col items-center justify-center text-center space-y-4'>
                                        <div className='bg-primary/10 rounded-full p-3'>
                                            <CheckCircle className='h-6 w-6 text-primary' />
                                        </div>
                                        <div className='space-y-2'>
                                            <h3 className='font-medium text-lg text-foreground'>Verification successful</h3>
                                            <p className='text-muted-foreground'>Your email has been verified. You will be redirected to reset your password.</p>
                                        </div>
                                        <div className='flex items-center space-x-2'>
                                            <Loader2 className='h-4 w-4 animate-spin text-primary' />
                                            <span className='text-sm text-muted-foreground'>Redirecting...</span>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {/* OTP Input (Theme Styling) */}
                                        <div className='flex justify-between mb-6'>
                                            {
                                                otp.map((digit, index) => (
                                                    <Input
                                                        key={index}
                                                        type="text"
                                                        value={digit}
                                                        onChange={(e) => handleChange(index, e.target.value)}
                                                        maxLength={1}
                                                        ref={(el) => (inputRefs.current[index] = el)}
                                                        className="w-12 h-12 text-center text-xl font-bold bg-input border-border text-foreground focus-visible:ring-ring"
                                                    />
                                                ))
                                            }
                                        </div>
                                        {/* Action Buttons (Theme Styling) */}
                                        <div className='space-y-3'>
                                            {/* Primary Button */}
                                            <Button
                                                onClick={handleVerify}
                                                disabled={isLoading || otp.some((digit) => digit === "")}
                                                className='w-full text-primary-foreground'
                                                variant="glow">
                                                {isLoading ? <><Loader2 className='mr-2 h-4 w-4 animate-spin' />Verifying</> : "Verify Code"}
                                            </Button>
                                            {/* Outline Secondary Button */}
                                            <Button variant='outline'
                                                onClick={clearOtp}
                                                className='w-full text-muted-foreground hover:bg-accent hover:text-foreground'
                                                disabled={isLoading || isVerified}>
                                                <RotateCcw className='mr-2 h-4 w-4' />
                                                Clear and Re-enter
                                            </Button>
                                        </div>
                                    </>
                                )
                            }
                        </CardContent>
                        <CardFooter className='flex justify-center'>
                            <p className='text-sm text-muted-foreground'>
                                Wrong email?{" "}
                                <Link to={'/forgotpassword'} className='text-primary hover:text-primary/80 font-medium'>Go back</Link>
                            </p>
                        </CardFooter>
                    </Card>
                    <div className='text-center text-xs text-muted-foreground mt-4'>
                        <p>
                            For testing purposes, use code: <span className='font-mono font-medium text-primary/80'>123456</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default VerifyOTP