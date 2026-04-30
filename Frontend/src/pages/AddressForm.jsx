import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { motion, AnimatePresence } from 'framer-motion'
import { MapPin, Phone, User, Globe, Navigation, Trash2, Loader2, Plus, CheckCircle2, Save, ArrowRight, Edit, X, Edit3 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { setAddresses, addAddress, updateAddressState, removeAddress, setSelectedId } from '@/redux/addressSlice'
import { toast } from 'sonner'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import axios from 'axios'
import { API_URL } from '@/config'

const AddressForm = () => {
  const dispatch = useDispatch()
  const { addresses = [], selectedId = null } = useSelector((state) => state.address || {})
  const cart = useSelector((state) => state.cart?.cart || {})
  const cartItems = cart?.items || []

  const subtotal = cart.totalPrice || 0
  const shippingCost = subtotal > 10000 ? 0 : 500;
  const tax = subtotal * 0.18;

  const [loading, setLoading] = useState(false)
  const [isActionLoading, setIsActionLoading] = useState(null)
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editId, setEditId] = useState(null)

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    country: 'India',
    state: '',
    pinCode: ''
  })

  const getAddresses = async () => {
    try {
      setLoading(true)
      const res = await axios.get(
        `${API_URL}/api/address/getAllAddresses`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (res.data.success) {
        dispatch(setAddresses(res.data.addresses));
      }
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
      } else {
        toast.error(`Failed to fetch addresses - ${error.response?.data?.message || error.message}`);
      }
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => {
    getAddresses()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleAddAddress = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const res = await axios.post(
        `${API_URL}/api/address/add`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (res.data.success) {
        dispatch(addAddress(res.data.address));
        toast.success("Address added successfully");
        setIsOpen(false);
        setFormData({ fullName: '', phone: '', address: '', city: '', country: 'India', state: '', pinCode: '' });
      }
    } catch (error) {
      toast.error(`Failed to add address - ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false)
    }
  }

  const handleEditAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put(
        `${API_URL}/api/address/update/${editId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );

      if (res.data.success) {
        dispatch(updateAddressState(res.data.address));
        toast.success("Address updated successfully");
        setIsOpen(false);
        setIsEditing(false);
        setEditId(null);
        setFormData({ fullName: '', phone: '', address: '', city: '', country: 'India', state: '', pinCode: '' });
      }
    } catch (error) {
      toast.error(`Failed to update address - ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false)
    }
  };

  const loadEditDialog = (addr) => {
    setIsEditing(true);
    setEditId(addr._id);
    setFormData({
      fullName: addr.fullName || '',
      phone: addr.phone || '',
      address: addr.address || '',
      city: addr.city || '',
      country: addr.country || 'India',
      state: addr.state || '',
      pinCode: addr.pinCode || ''
    });
    setIsOpen(true);
  };

  const handleDeleteAddress = async (id) => {
    try {
      setIsActionLoading(id);
      const res = await axios.delete(`${API_URL}/api/address/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`
        }
      });

      if (res.data.success) {
        dispatch(removeAddress(id));
        toast.info("Address removed");
      }
    } catch (error) {
      toast.error(`Failed to delete address - ${error.response?.data?.message || error.message}`);
    } finally {
      setIsActionLoading(null)
    }
  };

  return (
    <div className="container mx-auto px-4 py-6 md:my-10">
      <div className="flex flex-col lg:flex-row lg:justify-between gap-10 items-start">
        <div className="flex-1 w-full max-w-2xl">
          <div className="flex flex-col md:flex-row md:items-center justify-between px-2 mb-8 gap-4">
            <div>
              <h2 className="text-2xl md:text-3xl font-display font-bold text-charcoal tracking-tight leading-none">
                Delivery Address
              </h2>
              <p className="text-xs text-muted-foreground uppercase tracking-widest font-bold mt-1.5">
                Select or add a delivery location
              </p>
            </div>

            <Dialog open={isOpen} onOpenChange={(open) => {
              setIsOpen(open);
              if (!open) {
                setIsEditing(false);
                setFormData({ fullName: '', phone: '', address: '', city: '', country: 'India', state: '', pinCode: '' });
              }
            }}>
              <DialogTrigger asChild>
                <Button className="w-full md:w-auto rounded-full gradient-primary shadow-lg shadow-primary/20 gap-2 px-6">
                  <Plus className="h-4 w-4" /> Add New Address
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[90%] max-w-[500px] rounded-[2rem] p-6">
                <form onSubmit={isEditing ? handleEditAddress : handleAddAddress}>
                  <DialogHeader>
                    <DialogTitle className="font-display text-2xl">
                      {isEditing ? "Edit Shipping Address" : "New Shipping Address"}
                    </DialogTitle>
                    <DialogDescription>Enter the location details below.</DialogDescription>
                  </DialogHeader>

                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold tracking-widest">Full Name</Label>
                        <Input name="fullName" value={formData.fullName} onChange={handleChange} required className="rounded-xl h-11" placeholder="Shakeel Khan" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold tracking-widest">Phone</Label>
                        <Input name="phone" value={formData.phone} onChange={handleChange} required className="rounded-xl h-11" placeholder="+91..." />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[10px] uppercase font-bold tracking-widest">Street Address</Label>
                      <Input name="address" value={formData.address} onChange={handleChange} required className="rounded-xl h-11" placeholder="Flat, Building, Street" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold tracking-widest">City</Label>
                        <Input name="city" value={formData.city} onChange={handleChange} required className="rounded-xl h-11" />
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold tracking-widest">Pincode</Label>
                        <Input name="pinCode" value={formData.pinCode} onChange={handleChange} required className="rounded-xl h-11" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold tracking-widest">State</Label>
                        <select name="state" value={formData.state} onChange={handleChange} className="flex h-11 w-full rounded-xl border border-input bg-background px-3 py-2 text-sm focus:ring-2 focus:ring-primary outline-none text-muted-foreground">
                          <option value="">Select State</option>
                          <option value="Andhra Pradesh">Andhra Pradesh</option>
                          <option value="Telangana">Telangana</option>
                          <option value="Tamilnadu">Tamilnadu</option>
                          <option value="Karnataka">Karnataka</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <Label className="text-[10px] uppercase font-bold tracking-widest opacity-50">Country</Label>
                        <Input disabled value="India" className="rounded-xl bg-muted h-11" />
                      </div>
                    </div>
                  </div>

                  <DialogFooter className="gap-2 mt-4 flex-col-reverse sm:flex-row">
                    <DialogClose asChild>
                      <Button type="button" variant="ghost" className="rounded-xl w-full sm:w-auto">Cancel</Button>
                    </DialogClose>
                    <Button type="submit" disabled={loading} className="rounded-xl gradient-primary px-8 w-full sm:w-auto">
                      {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <><Save className="mr-2 h-4 w-4" /> Save Address</>}
                    </Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          <AnimatePresence mode="wait">
            {loading ? (
              <div className="space-y-4">
                {[1, 2].map((item) => (
                  <div key={item} className="p-6 border rounded-[2rem] bg-muted/30 animate-pulse h-28" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {addresses.length > 0 ? (
                  addresses.map((addr) => (
                    <motion.div
                      whileTap={{ scale: 0.98 }}
                      onClick={() => dispatch(setSelectedId(addr._id))}
                      key={addr._id}
                      className={`relative cursor-pointer p-5 md:p-6 rounded-[2rem] border-2 transition-all duration-300 ${
                        selectedId === addr._id
                          ? "border-primary bg-primary/[0.02] shadow-lg shadow-primary/5"
                          : "border-border/40 bg-white hover:border-border/80"
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                        <div className="flex gap-4 items-start w-full sm:w-auto">
                          <div className={`p-3 rounded-2xl h-12 w-12 flex items-center justify-center ${selectedId === addr._id ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                            <MapPin size={20} />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-charcoal text-base truncate max-w-[200px] sm:max-w-xs">
                              {addr.fullName}
                            </p>
                            <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">
                              {addr.address}, {addr.city} <br />
                              {addr.state} - {addr.pinCode}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-xs font-medium text-slate-500">
                              <Phone size={12} /> {addr.phone}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 self-end sm:self-center w-full sm:w-auto justify-between sm:justify-start border-t border-border/50 pt-3 sm:pt-0 mt-2 sm:mt-0">
                          <div className="flex items-center gap-1">
                            <Button 
                              variant="ghost" 
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                loadEditDialog(addr);
                              }}
                              className="rounded-full text-muted-foreground hover:text-primary h-9 w-9"
                            >
                              <Edit3 size={16} />
                            </Button>
                            <Button
                              variant="ghost" 
                              size="icon"
                              disabled={isActionLoading === addr._id}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteAddress(addr._id);
                              }}
                              className="rounded-full text-muted-foreground hover:text-destructive h-9 w-9"
                            >
                              {isActionLoading === addr._id ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
                            </Button>
                          </div>
                          {selectedId === addr._id && <CheckCircle2 className="text-primary h-5 w-5 ml-3" />}
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12 border-2 border-dashed border-border rounded-[2.5rem] bg-muted/20">
                    <MapPin className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                    <p className="text-muted-foreground text-sm font-medium">No addresses saved yet.</p>
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* --- ORDER SUMMARY PANEL --- */}
        {cartItems.length > 0 && (
          <aside className="w-full lg:w-96 lg:sticky lg:top-32">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-card border border-border rounded-[2.5rem] p-8 shadow-soft"
            >
              <h2 className="font-display text-2xl font-bold text-foreground mb-6">Summary</h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-muted-foreground">
                  <span>Subtotal</span>
                  <span className="text-foreground font-medium">₹{subtotal.toLocaleString("EN-IN")}</span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Shipping</span>
                  <span className={shippingCost === 0 ? "text-green-600 font-bold" : "text-foreground font-medium"}>
                    {shippingCost > 0 ? `₹${shippingCost}` : "FREE"}
                  </span>
                </div>
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax (GST 18%)</span>
                  <span className="text-foreground font-medium">₹{tax.toLocaleString("EN-IN")}</span>
                </div>

                <div className="border-t border-border pt-6 mt-6 flex justify-between items-end">
                  <span className="text-lg font-bold">Total Amount</span>
                  <div className="text-right">
                    <p className="text-3xl font-display font-bold text-primary">
                      ₹{(subtotal + shippingCost + tax).toLocaleString("EN-IN")}
                    </p>
                  </div>
                </div>
              </div>

              <Button variant="hero" className="w-full mt-8 h-14 rounded-2xl text-lg font-bold group shadow-lg shadow-primary/20">
                Order Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-[10px] text-muted-foreground text-center mt-6 uppercase tracking-widest font-bold opacity-60">
                Secure Checkout • DurableSofa
              </p>
            </motion.div>
          </aside>
        )}
      </div>
      
      <div className='bg-card border rounded-2xl p-6 mt-10'>
        <h1 className='text-primary font-display text-3xl font-bold'>Payment Method</h1>
        <p className="text-muted-foreground text-xs mt-1">Select your preferred payment gateway</p>
      </div>
    </div>
  )
}

export default AddressForm;