import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, Package, Box, Calendar, DollarSign, User, Shield, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '@/config';

const ShowUserOrders = () => {
  const [userOrders, setUserOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const params = useParams();
  const userId = params.userId;

  const getUserOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/orders/user-orders/${userId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });
      
      if (res.data.success) {
        setUserOrders(res.data.orders);
      }
    } catch (error) {
      toast.error("Failed to fetch user orders: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      getUserOrders();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground animate-pulse text-sm font-medium">Fetching User Orders...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-4 md:px-12 max-w-7xl mx-auto">
      <header className="mb-10 px-2 text-center md:text-left">
        <h1 className="font-display text-4xl font-bold tracking-tight text-charcoal">
          User Order Details
        </h1>
        <p className="text-muted-foreground font-medium mt-2 text-sm">
          Overview of transactions for ID: <span className="font-mono text-primary select-all">{userId}</span>
        </p>
      </header>

      <AnimatePresence mode="wait">
        {userOrders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {userOrders.map((order) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order._id}
                className="bg-[#FCFCFC] rounded-[2.5rem] border border-border/40 p-5 md:p-8 shadow-soft hover:shadow-2xl transition-all duration-500"
              >
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-6 border-b border-border/50 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Order ID
                    </span>
                    <p className="font-mono text-charcoal font-medium select-all text-xs">
                      {order._id}
                    </p>
                  </div>
                  
                  <div>
                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                      order.status.toLowerCase() === 'paid' || order.status.toLowerCase() === 'delivered'
                        ? 'bg-green-500/10 text-green-600 border-green-500/20'
                        : order.status.toLowerCase() === 'failed'
                        ? 'bg-red-500/10 text-red-600 border-red-500/20'
                        : 'bg-primary/10 text-primary border-primary/20'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-6 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-muted text-muted-foreground flex-shrink-0">
                      <Calendar size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] block font-black uppercase text-muted-foreground tracking-widest">
                        Placed On
                      </span>
                      <span className="text-xs font-semibold text-charcoal">
                        {new Date(order.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-muted text-muted-foreground flex-shrink-0">
                      <Package size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] block font-black uppercase text-muted-foreground tracking-widest">
                        Shipping Cost
                      </span>
                      <span className="text-xs font-semibold text-charcoal">
                        ₹{order.shipping?.toLocaleString('en-IN') || '0'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-muted text-muted-foreground flex-shrink-0">
                      <DollarSign size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] block font-black uppercase text-muted-foreground tracking-widest">
                        Total Amount
                      </span>
                      <span className="text-base font-display font-bold text-primary">
                        ₹{order.totalPrice?.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="pt-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Purchased Items
                  </h4>
                  <div className="space-y-3">
                    {order.products?.map((item, index) => {
                      const productDetails = item.productID || item;
                      const name = productDetails.name || item.name;
                      const price = productDetails.basePrice || item.price || 0;
                      const imageUrl = productDetails.productImages?.[0]?.url;

                      return (
                        <div 
                          key={item._id || index} 
                          className="flex items-center justify-between gap-4 p-3 bg-white/50 border border-border/40 rounded-2xl"
                        >
                          <div className="flex items-center gap-4 flex-1 truncate">
                            {imageUrl ? (
                              <img 
                                src={imageUrl} 
                                alt={name} 
                                className="h-12 w-12 rounded-xl object-cover border border-border/50 shadow-sm flex-shrink-0 cursor-pointer"
                                onClick={() => navigate(`/product/${productDetails._id}`)}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground border border-border/50 flex-shrink-0">
                                <Box size={18} />
                              </div>
                            )}
                            <div className="truncate">
                              <p className="text-xs font-bold text-charcoal truncate max-w-[200px] md:max-w-md">
                                {name}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5">
                                <span className="text-[9px] font-medium text-charcoal/80 bg-muted px-2.5 py-0.5 rounded-full border">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-[9px] text-muted-foreground">
                                  ID: {item._id?.slice(-6).toUpperCase() || 'N/A'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="font-display font-bold text-sm text-charcoal flex-shrink-0 pr-2">
                            ₹{price.toLocaleString('en-IN')}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="min-h-[40vh] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[2.5rem] bg-muted/20 text-center p-8"
          >
            <Package className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
            <p className="text-muted-foreground font-medium">No orders found for this user.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ShowUserOrders;