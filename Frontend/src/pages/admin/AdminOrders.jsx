import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, Package, Box, Calendar, DollarSign, Search, X, 
  User, Mail, Shield, CheckCircle, RefreshCw 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import axios from 'axios';
import { API_URL } from '@/config';

const SearchBar = ({ searchValue, setSearchValue }) => (
  <div className="relative w-full max-w-md mb-8">
    <div className="relative flex items-center bg-white/50 backdrop-blur-md border border-border rounded-2xl overflow-hidden transition-all hover:border-primary/50 shadow-sm focus-within:shadow-md">
      <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
      <Input
        type="text"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        placeholder="Search by Order ID, name, or email..."
        className="w-full py-7 pl-12 pr-12 bg-transparent text-foreground placeholder:text-muted-foreground border-none focus-visible:ring-0 focus-visible:ring-offset-0"
      />
      {searchValue && (
        <button
          onClick={() => setSearchValue("")}
          className="absolute right-3 p-1.5 hover:bg-muted rounded-full transition-colors"
          type="button"
        >
          <X className="w-4 h-4 text-muted-foreground" />
        </button>
      )}
    </div>
  </div>
);

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const getAllOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/orders/all-orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`
        }
      });

      if (res.data.success) {
        setOrders(res.data.orders);
        toast.success("Orders fetched successfully");
      }
    } catch (error) {
      toast.error("Failed to fetch orders: " + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    if (!searchValue.trim()) return orders;
    const query = searchValue.toLowerCase();
    
    return orders.filter(order => 
      order._id?.toLowerCase().includes(query) ||
      order.userId?.lastName?.toLowerCase().includes(query) ||
      order.userId?.email?.toLowerCase().includes(query) ||
      order.status?.toLowerCase().includes(query)
    );
  }, [orders, searchValue]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground animate-pulse text-sm">Loading Order Management...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-28 pb-20 px-6 md:px-12 max-w-7xl mx-auto">
      <header className="mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-charcoal">
            Order Management
          </h1>
          <p className="text-muted-foreground font-medium mt-2">
            Monitor and process all transactions in your showroom.
          </p>
        </div>
        <Button 
          onClick={getAllOrders}
          variant="outline"
          className="h-12 rounded-2xl gap-2 border-border/60 text-charcoal"
        >
          <RefreshCw size={16} /> Refresh
        </Button>
      </header>

      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />

      <AnimatePresence mode="wait">
        {filteredOrders.length > 0 ? (
          <div className="grid grid-cols-1 gap-6">
            {filteredOrders.map((order) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order._id}
                className="bg-[#FCFCFC] rounded-[2.5rem] border border-border/40 p-8 shadow-soft hover:shadow-2xl transition-all duration-500"
              >
                {/* Order Meta Header */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-6 border-b border-border/50 gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Order ID
                    </span>
                    <p className="font-mono text-charcoal font-medium select-all text-xs">
                      {order._id}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
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

                {/* User & Financial Information Grid */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 py-6 border-b border-border/50">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-muted text-muted-foreground">
                      <User size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] block font-black uppercase text-muted-foreground tracking-widest">
                        Customer
                      </span>
                      <span className="text-xs font-bold text-charcoal">
                        {order.userId?.lastName || "Unknown Member"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-muted text-muted-foreground">
                      <Mail size={18} />
                    </div>
                    <div>
                      <span className="text-[9px] block font-black uppercase text-muted-foreground tracking-widest">
                        Email
                      </span>
                      <span className="text-xs font-medium text-charcoal truncate max-w-[150px]">
                        {order.userId?.email || "N/A"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-muted text-muted-foreground">
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

                  <div className="flex items-center justify-between md:justify-start gap-4">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-2xl bg-muted text-muted-foreground">
                        <DollarSign size={18} />
                      </div>
                      <div>
                        <span className="text-[9px] block font-black uppercase text-muted-foreground tracking-widest">
                          Amount
                        </span>
                        <span className="text-xl font-display font-bold text-primary">
                          ₹{order.totalPrice?.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Purchased Items Sub-list */}
                <div className="pt-6">
                  <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-4">
                    Purchased Products
                  </h4>
                  <div className="space-y-3">
                    {order.products?.map((item, index) => {
                      const productData = item.productID || item;
                      const name = productData.name || "Item not found";
                      const price = productData.basePrice || 0;
                      const imageUrl = productData.productImages?.[0]?.url;

                      return (
                        <div 
                          key={item._id || index} 
                          className="flex items-center justify-between gap-4 p-4 bg-white/50 border border-border/40 rounded-2xl"
                        >
                          <div className="flex items-center gap-4 flex-1 truncate">
                            {imageUrl ? (
                              <img 
                                src={imageUrl} 
                                alt={name} 
                                className="h-12 w-12 rounded-xl object-cover border border-border/50 shadow-sm flex-shrink-0"
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
                              <p className="text-[9px] font-medium text-muted-foreground mt-0.5">
                                Qty: {item.quantity}
                              </p>
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
            className="min-h-[50vh] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-[3rem] bg-muted/20 text-center p-8"
          >
            <Package className="w-16 h-16 text-muted-foreground/30 mb-4" />
            <h3 className="font-display text-2xl font-bold text-charcoal mb-2">No orders found</h3>
            <p className="text-muted-foreground text-sm max-w-xs mx-auto">
              No orders matched your search criteria.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrders;