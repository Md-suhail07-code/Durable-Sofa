import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CheckCircle2, Package, ShoppingBag } from 'lucide-react'
import { Button } from '@/components/ui/button'

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className='min-h-screen bg-background flex justify-center items-center px-6'>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="bg-[#FCFCFC] rounded-[2.5rem] border border-border/60 p-10 flex flex-col items-center shadow-soft w-full max-w-md text-center"
      >
        {/* Premium Success Icon Container */}
        <div className="h-16 w-16 rounded-3xl bg-green-500/10 flex items-center justify-center text-green-600 mb-6">
          <CheckCircle2 size={36} className="stroke-[1.5]" />
        </div>

        {/* Heading */}
        <h1 className="font-display text-3xl font-bold text-charcoal mb-4 tracking-tight">
          Order Placed Successfully!
        </h1>

        {/* Message */}
        <p className="text-muted-foreground text-sm leading-relaxed max-w-xs mx-auto mb-8">
          Thank you for choosing DurableSofa. Your order has been confirmed and is being prepared for delivery.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col w-full gap-3">
          <Button 
            onClick={() => navigate('/products')} 
            className="h-14 rounded-2xl gradient-primary font-black tracking-wider uppercase text-xs shadow-lg shadow-primary/20 transition-all hover:opacity-95 active:scale-95 text-white"
          >
            <ShoppingBag className="mr-2 h-4 w-4" />
            Continue Shopping
          </Button>
          
          <Button 
            onClick={() => navigate('/orders')} 
            variant="outline" 
            className="h-14 rounded-2xl border-border/60 text-charcoal font-black tracking-wider uppercase text-xs hover:bg-muted/50 transition-all active:scale-95"
          >
            <Package className="mr-2 h-4 w-4" />
            View My Orders
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

export default OrderSuccess