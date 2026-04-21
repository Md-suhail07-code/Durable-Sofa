import CartCard from '@/components/CartCard'
import { Navbar } from '@/components/Navbar'
import { Button } from '@/components/ui/button'
import { setCart } from '@/redux/cartSlice'
import axios from 'axios'
import { Loader2, ShoppingCart, ArrowRight } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

const Cart = () => {
  const [cartItems, setCartItems] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  
  const cart = useSelector((state) => state.cart.cart || [])

  const API = "http://localhost:5000/api/cart"
  const accessToken = localStorage.getItem("accessToken")

  const updateQuantity = async (productID, type) => {
    try {
      const res = await axios.put(`${API}/update-quantity`, {productID, type}, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        }
      })
      if (res.data.success) {
        dispatch(setCart(res.data.cart))
        setCartItems(res.data.cart.items)
        toast.success("Quantity updated successfully")
      }
      else{
        toast.error("Could not update quantity")
      }
    } catch (error) {
      toast.error("Failed to update quantity")
      console.error("Update Quantity Error:", error)
    }
  }

  const removeFromCart = async (productID) => {
    try {
      const res = await axios.delete(`${API}/remove-item`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        data: { productID }
      })
      if(res.data.success){
        dispatch(setCart(res.data.cart))
        setCartItems(res.data.cart.items)
        toast.success("Item removed from cart")
      }
      else{
        toast.error("Could not remove item")
      }
    } catch (error) {
      toast.error("Failed to remove item")
      console.error("Remove From Cart Error:", error)
    }
  }

  useEffect(() => {
    const fetchCart = async () => {
      setIsLoading(true)
      try {
        const res = await axios.get(`${API}/get-cart`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          }
        });
        const cart = res.data.cart;
        dispatch(setCart(cart));
        setCartItems(cart.items);
      } catch (error) {
        console.error("Error fetching cart items:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchCart()
  }, [dispatch])

  const subtotal = cart.totalPrice
  const shippingCost = subtotal > 10000 ? 0 : 500;
  const tax = subtotal * 0.18;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-6 pt-32 pb-20">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="font-display text-4xl md:text-5xl font-bold text-foreground mb-10"
        >
          Your Shopping Bag
        </motion.h1>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
                <p className="font-medium animate-pulse text-muted-foreground">Syncing your items...</p>
              </div>
            ) : cartItems.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col items-center justify-center text-center py-24 bg-card rounded-3xl border border-dashed border-border shadow-soft"
              >
                <div className='h-30 w-30 pt-5 pr-1 bg-primary/20 rounded-full flex items-center justify-center mb-4'>
                  <ShoppingCart className="h-16 w-16 mx-auto text-primary mb-6 opacity-40" />
                </div>
                <h3 className="text-2xl font-display font-bold text-foreground">Your Bag is Empty</h3>
                <p className="text-muted-foreground mt-2 max-w-xs mx-auto">Looks like you haven't added any luxury pieces to your home yet.</p>
                <Link to="/products">
                  <Button variant="glow" className="mt-8 px-8">
                    Explore Collection
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-6">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item, index) => (
                    <motion.div
                      key={item?._id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <CartCard item={item} updateQuantity={updateQuantity} removeFromCart={removeFromCart}/>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {cartItems.length > 0 && (
            <aside className="lg:w-96">
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-card border border-border rounded-2xl p-8 sticky top-32 shadow-soft"
              >
                <h2 className="font-display text-2xl font-bold text-foreground mb-6">Summary</h2>
                
                <div className="space-y-4 text-sm">
                  <div className="flex justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="text-foreground font-medium">₹{subtotal.toLocaleString("EN-IN")}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Estimated Shipping</span>
                    <span className="text-green-600 font-medium">{shippingCost > 0 ? `₹${shippingCost}` : "Free"}</span>
                  </div>
                  <div className="flex justify-between text-muted-foreground">
                    <span>Tax (GST)</span>
                    <span className="text-foreground font-medium">₹{tax.toLocaleString("EN-IN")}</span>
                  </div>
                  
                  <div className="border-t border-border pt-4 mt-4 flex justify-between items-end">
                    <span className="text-lg font-bold">Total</span>
                    <div className="text-right">
                      <p className="text-2xl font-display font-bold text-primary">₹{(subtotal + shippingCost + tax).toLocaleString("EN-IN")}</p>
                    </div>
                  </div>
                </div>

                <Button onClick={() => navigate('/address')} variant="hero" className="w-full mt-8 h-14 text-lg group">
                  Order Now
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>

                <p className="text-[10px] text-muted-foreground text-center mt-4 uppercase tracking-widest">
                  
                </p>
              </motion.div>
            </aside>
          )}
        </div>
      </main>
    </div>
  )
}

export default Cart