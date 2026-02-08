import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

const CartCard = ({ item, updateQuantity, removeFromCart }) => {
  const { productID, quantity, unitPrice } = item;
  
  if (!productID) return null;

  const { category, name, productImages } = productID;
  const imageUrl = productImages?.length > 0 ? productImages[0].url : '/placeholder-sofa.jpg';

  return (
    <div className='relative flex flex-col sm:flex-row items-center gap-4 border border-border rounded-2xl p-4 bg-card hover:shadow-soft transition-all duration-300'>
      
      {/* Product Image */}
      <div className='w-full sm:w-32 h-32 flex-shrink-0'>
        <img 
          src={imageUrl} 
          alt={name} 
          className='w-full h-full object-cover rounded-xl border border-border/50' 
        />
      </div>

      {/* Product Info & Actions */}
      <div className='flex flex-col md:flex-row flex-1 w-full justify-between items-start md:items-center gap-4'>
        
        {/* Title & Category */}
        <div className='flex-1 space-y-1'>
          <Badge variant="secondary" className="text-[10px] uppercase tracking-wider px-2 py-0">
            {category}
          </Badge>
          <h3 className='font-display font-bold text-lg text-foreground line-clamp-1'>{name}</h3>
          <p className='text-muted-foreground font-medium'>₹{unitPrice.toLocaleString('en-IN')}</p>
        </div>

        {/* Quantity Controls */}
        <div className='flex items-center gap-3 bg-muted/50 rounded-full p-1 border border-border'>
          <Button 
            onClick={() => updateQuantity(productID._id, 'decrement')}
            disabled={quantity <= 1}
            className="rounded-full w-8 h-8 p-0 hover:bg-primary/20" 
            variant="ghost" 
            size="sm"
          >
            <Minus className='h-4 w-4' />
          </Button>
          
          <span className='w-6 text-center text-foreground font-bold font-display'>{quantity}</span>
          
          <Button 
            onClick={() => updateQuantity(productID._id, 'increment')}
            className="rounded-full w-8 h-8 p-0 hover:bg-primary/20" 
            variant="ghost" 
            size="sm"
          >
            <Plus className='h-4 w-4' />
          </Button>
        </div>

        {/* Subtotal */}
        <div className='hidden md:block min-w-[100px] text-right'>
          <p className='text-xs text-muted-foreground uppercase font-bold tracking-tighter'>Subtotal</p>
          <p className='font-bold font-display text-primary text-xl'>
            ₹{(unitPrice * quantity).toLocaleString('en-IN')}
          </p>
        </div>

        {/* Mobile Subtotal & Remove */}
        <div className='flex md:hidden w-full justify-between items-center border-t border-border pt-3 mt-1'>
           <p className='font-bold font-display text-primary text-lg'>
             Total: ₹{(unitPrice * quantity).toLocaleString('en-IN')}
           </p>
           <button 
             onClick={() => removeFromCart(productID._id)}
             className='p-2 text-destructive hover:bg-destructive/10 rounded-full transition-colors'
           >
             <Trash2 className='h-5 w-5' />
           </button>
        </div>
      </div>

      {/* Desktop Remove Button (Absolute Positioned for cleaner look) */}
      <button 
        onClick={() => removeFromCart(productID._id)}
        className='hidden md:block hover:bg-destructive/10 text-destructive p-2 rounded-full absolute top-4 right-4 transition-colors'
      >
        <Trash2 className='h-4 w-4' />
      </button>
    </div>
  )
}

export default CartCard