import React, { useState } from 'react'
import { Card } from './ui/card'
import { Edit3, Trash2, Tag, Loader2, Save } from 'lucide-react'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Button } from './ui/button'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import axios from 'axios'
import { setProducts } from '@/redux/productSlice'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
    DialogClose
} from "@/components/ui/dialog"
import { useDispatch, useSelector } from 'react-redux'
import { API_URL } from '@/config'

const AdminProductDetails = ({ details, onProductUpdate }) => {
    const { _id, name, basePrice, category, description, productImages } = details
    const [isUpdating, setIsUpdating] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const dispatch = useDispatch()
    const { products } = useSelector((state) => state.product)

    const [formData, setFormData] = useState({
        name: name,
        basePrice: basePrice,
        category: category,
        description: description
    })

    const handleChange = (e) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleEdit = async (e) => {
        e.preventDefault()
        setIsUpdating(true)
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.put(`${API_URL}/api/products/update-products/${_id}`, formData, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if (res.data.success) {
                toast.success("Product updated successfully");
                const updatedProducts = products.map(p => p._id === _id ? res.data.product : p);
                dispatch(setProducts(updatedProducts));
                setIsOpen(false);
                if (onProductUpdate) onProductUpdate();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error editing product. Please try again.");
        } finally {
            setIsUpdating(false)
        }
    }

    const handleDelete = async () => {
        try {
            const token = localStorage.getItem("accessToken");
            const res = await axios.delete(`${API_URL}/api/products/delete-products/${_id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            if(res.data.success) {
                toast.success("Product deleted successfully");
                const updatedProducts = products.filter(p => p._id !== _id);
                dispatch(setProducts(updatedProducts));
                if (onProductUpdate) onProductUpdate();
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Error deleting product. Please try again.");
        }
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="w-full max-w-[350px]"
        >
            <Card className="group relative bg-[#FCFCFC] rounded-2xl overflow-hidden border-none shadow-soft hover:shadow-2xl transition-all duration-500">

                {/* Image Section */}
                <div className="relative aspect-[4/5] overflow-hidden bg-muted">
                    <img
                        src={productImages[0]?.url}
                        alt={name}
                        className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />

                    {/* Minimalist Action Overlay */}
                    <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                        <Dialog open={isOpen} onOpenChange={setIsOpen}>
                            <DialogTrigger asChild>
                                <button className="flex items-center gap-2 px-4 py-2 bg-white text-charcoal rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-primary hover:text-white transition-all active:scale-95">
                                    <Edit3 size={14} />
                                    Edit
                                </button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px] rounded-3xl">
                                <form onSubmit={handleEdit}>
                                    <DialogHeader>
                                        <DialogTitle className="font-display text-2xl">Edit Product</DialogTitle>
                                        <DialogDescription className="text-muted-foreground">
                                            Modify the details below. Changes are applied in real-time to the gallery.
                                        </DialogDescription>
                                    </DialogHeader>

                                    <div className="grid gap-4 py-6">
                                        <div className="grid gap-2">
                                            <Label htmlFor="name" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Product Name</Label>
                                            <Input id="name" value={formData.name} onChange={handleChange} className="rounded-xl border-slate-200 focus:ring-primary" required />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="grid gap-2">
                                                <Label htmlFor="basePrice" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Price (₹)</Label>
                                                <Input id="basePrice" type="number" value={formData.basePrice} onChange={handleChange} className="rounded-xl border-slate-200" required />
                                            </div>
                                            <div className="grid gap-2">
                                                <Label htmlFor="category" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Category</Label>
                                                <Input id="category" value={formData.category} onChange={handleChange} className="rounded-xl border-slate-200" required />
                                            </div>
                                        </div>

                                        <div className="grid gap-2">
                                            <Label htmlFor="description" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Description</Label>
                                            <Textarea
                                                id="description"
                                                value={formData.description}
                                                onChange={handleChange}
                                                className="rounded-xl border-slate-200 min-h-[100px] resize-none"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <DialogFooter className="gap-2">
                                        <DialogClose asChild>
                                            <Button type="button" variant="ghost" className="rounded-xl">Cancel</Button>
                                        </DialogClose>
                                        <Button onClick={handleEdit} type="submit" disabled={isUpdating} className="rounded-xl gradient-primary px-8 shadow-lg shadow-primary/20">
                                            {isUpdating ? (
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                            ) : (
                                                <><Save className="mr-2 h-4 w-4" /> Save Changes</>
                                            )}
                                        </Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>

                        <Dialog>
                            <DialogTrigger>
                                <button className="p-2.5 bg-white/90 text-destructive rounded-full shadow-xl hover:bg-red-600 hover:text-white transition-all active:scale-95">
                                    <Trash2 size={16} />
                                </button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Are you absolutely sure?</DialogTitle>
                                    <DialogDescription>
                                        This action cannot be undone. This will permanently delete this product from our database.
                                    </DialogDescription>
                                </DialogHeader>
                                <DialogFooter className="gap-2">
                                    <DialogClose asChild>
                                        <Button type="button" variant="ghost" className="rounded-xl shadow-xl">Cancel</Button>
                                    </DialogClose>
                                    <Button onClick={handleDelete} type="submit" disabled={isUpdating} className="p-2.5 bg-white/90 text-destructive rounded-full shadow-xl hover:bg-red-600 hover:text-white transition-all active:scale-95">
                                        {isUpdating ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <><Save className="mr-2 h-4 w-4" />Confirm</>
                                        )}
                                    </Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>

                    </div>

                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-3 py-1.5 bg-white/80 backdrop-blur-md rounded-lg shadow-sm border border-white/20">
                        <Tag size={10} className="text-primary" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-charcoal">
                            {category}
                        </span>
                    </div>
                </div>

                <div className="p-6">
                    <div className="space-y-1 mb-4">
                        <h3 className="text-xl font-display font-bold text-charcoal truncate">
                            {name}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed italic">
                            {description}
                        </p>
                    </div>

                    <div className="flex items-baseline justify-between pt-4 border-t border-border/50">
                        <div className="flex flex-col">
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
                                MSRP
                            </span>
                            <span className="text-2xl font-display font-bold text-primary">
                                ₹{basePrice.toLocaleString('en-IN')}
                            </span>
                        </div>
                    </div>
                </div>
            </Card>
        </motion.div>
    )
}

export default AdminProductDetails