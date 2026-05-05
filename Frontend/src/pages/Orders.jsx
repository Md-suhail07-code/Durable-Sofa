import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Package,
  Box,
  Calendar,
  DollarSign,
  ShoppingBag,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";
import { API_URL } from "@/config";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const getOrders = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_URL}/api/orders/my-orders`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      });

      if (res.data.success) {
        setOrders(res.data.orders);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Failed to fetch orders. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={48} />
        <p className="text-muted-foreground animate-pulse text-sm">
          Loading your orders...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pt-24 pb-16 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto">
      <header className="mb-8 text-center md:text-left">
        <h1 className="font-display text-3xl md:text-5xl font-bold tracking-tight text-charcoal">
          My Orders
        </h1>
        <p className="text-muted-foreground text-sm font-medium mt-1">
          Track and manage your premium purchases
        </p>
      </header>

      <AnimatePresence mode="wait">
        {orders.length > 0 ? (
          <div className="grid grid-cols-1 gap-5">
            {orders.map((order) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                key={order._id}
                className="bg-[#FCFCFC] rounded-[2rem] md:rounded-[2.5rem] border border-border/40 p-5 md:p-8 shadow-soft hover:shadow-2xl transition-all duration-500"
              >
                {/* Header Information */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 border-b border-border/50 gap-3">
                  <div className="space-y-0.5 truncate w-full sm:w-auto">
                    <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                      Order ID
                    </span>
                    <p className="font-mono text-charcoal font-medium select-all text-xs truncate">
                      {order._id}
                    </p>
                  </div>

                  <div className="flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                        order.status.toLowerCase() === "paid" ||
                        order.status.toLowerCase() === "delivered"
                          ? "bg-green-500/10 text-green-600 border-green-500/20"
                          : order.status.toLowerCase() === "failed"
                            ? "bg-red-500/10 text-red-600 border-red-500/20"
                            : "bg-primary/10 text-primary border-primary/20"
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Financial/Meta Data Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 py-5 border-b border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-muted text-muted-foreground flex-shrink-0">
                      <Calendar size={16} />
                    </div>
                    <div>
                      <span className="text-[8px] block font-black uppercase text-muted-foreground tracking-widest">
                        Placed On
                      </span>
                      <span className="text-xs font-semibold text-charcoal">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-muted text-muted-foreground flex-shrink-0">
                      <Package size={16} />
                    </div>
                    <div>
                      <span className="text-[8px] block font-black uppercase text-muted-foreground tracking-widest">
                        Shipping Cost
                      </span>
                      <span className="text-xs font-semibold text-charcoal">
                        ₹{order.shipping?.toLocaleString("en-IN") || "0"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-2xl bg-muted text-muted-foreground flex-shrink-0">
                      <DollarSign size={16} />
                    </div>
                    <div>
                      <span className="text-[8px] block font-black uppercase text-muted-foreground tracking-widest">
                        Total Amount
                      </span>
                      <span className="text-base font-display font-bold text-primary">
                        ₹{order.totalPrice?.toLocaleString("en-IN")}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Items List */}
                <div className="pt-5">
                  <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-3 ml-1">
                    Purchased Items
                  </h4>
                  <div className="space-y-3">
                    {order.products?.map((item) => {
                      const productDetails = item.productID || item;
                      const name = productDetails.name || item.name;
                      const price = productDetails.basePrice || item.price || 0;
                      const imageUrl = productDetails.productImages?.[0]?.url;

                      return (
                        <div
                          key={item._id}
                          className="flex items-center justify-between gap-4 p-3 bg-white border border-border/40 rounded-xl"
                        >
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            {imageUrl ? (
                              <img
                                src={imageUrl || "/placeholder-product.jpg"}
                                alt={name || "Product"}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  if (productDetails?._id) {
                                    navigate(`/product/${productDetails._id}`);
                                  } else {
                                    toast.info("Product details not available");
                                  }
                                }}
                                onError={(e) => {
                                  e.target.src = "/placeholder-product.jpg";
                                }}
                                className={`h-12 w-12 rounded-xl object-cover border border-border/50 shadow-sm flex-shrink-0 ${
                                  productDetails?._id
                                    ? "cursor-pointer"
                                    : "cursor-not-allowed opacity-60"
                                }`}
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center text-muted-foreground border border-border/50 flex-shrink-0">
                                <Box size={18} />
                              </div>
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-charcoal truncate">
                                {name}
                              </p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[9px] font-semibold text-charcoal/80 bg-muted px-2 py-0.5 rounded-full border">
                                  Qty: {item.quantity}
                                </span>
                                <span className="text-[9px] text-muted-foreground truncate">
                                  ID: {item._id?.slice(-6).toUpperCase()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="font-display font-bold text-xs text-charcoal flex-shrink-0 pl-2">
                            ₹{price.toLocaleString("en-IN")}
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
            className="min-h-[40vh] flex flex-col items-center justify-center border-2 border-dashed border-border rounded-3xl bg-muted/20 text-center p-6"
          >
            <Package className="w-12 h-12 text-muted-foreground/30 mb-3" />
            <h3 className="font-display text-xl font-bold text-charcoal mb-1">
              No orders found
            </h3>
            <p className="text-muted-foreground text-xs max-w-xs mx-auto mb-5">
              Looks like you haven't placed any orders with us yet.
            </p>
            <Button
              onClick={() => navigate("/products")}
              className="rounded-xl h-10 gradient-primary px-6 text-xs text-white"
            >
              Browse Collections
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
