import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const AddProduct = () => {
    const [formData, setFormData] = useState({
        name: "",
        category: "sofa",
        description: "",
        basePrice: "",
        customizable: false,
        materials: "",
        dimensions: "",
        images: [],
    });

    const userState = useSelector((state) => state.user)
    const user = userState.user;
    const [isAdmin, setIsAdmin] = useState(false)

    useEffect(() => {
        if (user.role !== "admin") {
            setTimeout(() => {
                window.location.href = "/"
            }, 3000)
        }
        else{
            setIsAdmin(true)
        }
    },[user])

    if (user.role !== "admin") {
        return (
            <div className="flex justify-center items-center h-screen w-screen">
                <h1 className="text-5xl font-display text-destructive">Access Denied. Only Admins can add Products</h1>
            </div>
        )
    }

    const [isLoading, setIsLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'radio' ? checked : value
        }));
    };
    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({ ...prev, images: files }));
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key !== 'images') {
                data.append(key, formData[key]);
            }
        });
        formData.images.forEach((file, index) => {
            data.append(`files`, file);
        });

        try {
            const res = await axios.post("http://localhost:5000/api/products/add", data, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                },
            });

            if (res.data.success) {
                toast.success(res.data.message || "Product added successfully!");
                setFormData({
                    name: "", category: "sofa", description: "", basePrice: "",
                    customizable: false, materials: "", dimensions: "", images: [],
                });
                setImagePreviews([]);
            } else {
                toast.error(res.data.message || "Failed to add product.");
            }
        } catch (error) {
            console.error("Product Add Error:", error);
            toast.error(error.response?.data?.message || "An unexpected error occurred.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-32">
                <motion.h1
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-10"
                >
                    Add New Product
                </motion.h1>

                <form onSubmit={handleSubmit} className="bg-card p-8 rounded-xl shadow-medium border border-border">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                        {/* 1. Name */}
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="text-sm font-medium text-muted-foreground">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                placeholder="E.g., Chesterfield Sofa"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 2. Category (Select) */}
                        <div className="grid gap-2">
                            <Label htmlFor="category" className="text-sm font-medium text-muted-foreground">Category</Label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="h-10 px-3 py-2 text-sm bg-input border border-border rounded-md focus-visible:ring-ring focus-visible:outline-none"
                            >
                                <option value="sofa">Sofa</option>
                                <option value="headboard">Headboard</option>
                                <option value="pillow">Pillow</option>
                                <option value="mattress">Mattress</option>
                            </select>
                        </div>

                        {/* 3. Base Price */}
                        <div className="grid gap-2">
                            <Label htmlFor="basePrice" className="text-sm font-medium text-muted-foreground">Base Price (USD)</Label>
                            <Input
                                id="basePrice"
                                name="basePrice"
                                type="number"
                                placeholder="E.g., 1299.99"
                                value={formData.basePrice}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* 4. Description (Full Width) */}
                        <div className="grid gap-2 md:col-span-2 lg:col-span-3">
                            <Label htmlFor="description" className="text-sm font-medium text-muted-foreground">Description</Label>
                            <Textarea
                                id="description"
                                name="description"
                                placeholder="Detailed product features and specifications..."
                                value={formData.description}
                                onChange={handleChange}
                                required
                                className="min-h-[100px]"
                            />
                        </div>

                        {/* 5. Materials */}
                        <div className="grid gap-2">
                            <Label htmlFor="materials" className="text-sm font-medium text-muted-foreground">Materials</Label>
                            <Input
                                id="materials"
                                name="materials"
                                type="text"
                                placeholder="E.g., Velvet, Oak Wood, Foam"
                                value={formData.materials}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 6. Dimensions */}
                        <div className="grid gap-2">
                            <Label htmlFor="dimensions" className="text-sm font-medium text-muted-foreground">Dimensions</Label>
                            <Input
                                id="dimensions"
                                name="dimensions"
                                type="text"
                                placeholder="E.g., 80W x 40L x 30H"
                                value={formData.dimensions}
                                onChange={handleChange}
                            />
                        </div>

                        {/* 7. Customizable (Radio Buttons) */}
                        <div className="grid gap-3 p-4 border border-border rounded-md bg-muted/20">
                            <Label className="text-sm font-medium text-foreground">Customizable?</Label>
                            <div className="flex items-center space-x-6">
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="customizableTrue"
                                        name="customizable"
                                        type="radio"
                                        checked={formData.customizable === true}
                                        onChange={() => setFormData(prev => ({ ...prev, customizable: true }))}
                                        className="h-4 w-4 text-primary border-border focus:ring-primary"
                                    />
                                    <Label htmlFor="customizableTrue" className="text-sm font-normal">True</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input
                                        id="customizableFalse"
                                        name="customizable"
                                        type="radio"
                                        checked={formData.customizable === false}
                                        onChange={() => setFormData(prev => ({ ...prev, customizable: false }))}
                                        className="h-4 w-4 text-primary border-border focus:ring-primary"
                                    />
                                    <Label htmlFor="customizableFalse" className="text-sm font-normal">False</Label>
                                </div>
                            </div>
                        </div>

                        {/* 8. Images (File Input, Full Width) */}
                        <div className="grid gap-2 lg:col-span-3">
                            <Label htmlFor="images" className="text-sm font-medium text-muted-foreground">Product Images (Max 5)</Label>
                            <Input
                                id="images"
                                name="images"
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="p-2 file:text-primary file:font-medium file:bg-primary/10 file:border-primary"
                            />
                        </div>

                        {formData.images.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                {formData.images.length} file(s) selected
                            </p>
                        )}


                        {/* 9. Image Previews */}
                        {imagePreviews.length > 0 && (
                            <div className="grid grid-cols-5 gap-3 lg:col-span-3 border border-border rounded-md p-4 bg-muted/10">
                                {imagePreviews.map((src, index) => (
                                    <div key={index} className="relative aspect-square overflow-hidden rounded-md">
                                        <img src={src} alt={`Product preview ${index + 1}`} className="w-full h-full object-cover" />
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>

                    {/* Submit Button */}
                    <motion.div whileTap={{ scale: 0.99 }} className="mt-8">
                        <Button
                            type="submit"
                            variant="glow"
                            className="w-full md:w-auto px-10 font-semibold"
                            disabled={isLoading || !formData.name || !formData.description || !formData.basePrice}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Adding Product...
                                </>
                            ) : "Add Product"}
                        </Button>
                    </motion.div>
                </form>
            </div>
        </div>
    );
};

export default AddProduct;