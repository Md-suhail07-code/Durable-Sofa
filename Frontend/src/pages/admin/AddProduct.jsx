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
import { API_URL } from "@/config";

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

    const user = useSelector((state) => state.user.user);
    const [isLoading, setIsLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);

    useEffect(() => {
        return () => {
            imagePreviews.forEach(url => URL.revokeObjectURL(url));
        };
    }, [imagePreviews]);

    if (!user || user.role!== "admin") {
        return <Navigate to="/" replace />;
    }

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
           ...prev,
            [name]: type === 'checkbox'? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({...prev, images: files }));
        const previews = files.map(file => URL.createObjectURL(file));
        setImagePreviews(previews);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => {
            if (key!== 'images') {
                data.append(key, formData[key]);
            }
        });
        formData.images.forEach((file) => {
            data.append(`files`, file);
        });

        try {
            const res = await axios.post(`${API_URL}/api/products/add`, data, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem("accessToken")}`,
                    "Content-Type": "multipart/form-data",
                },
            });

            if (res.data.success) {
                toast.success(res.data.message || "Product added successfully!");
                setFormData({
                    name: "",
                    category: "sofa",
                    description: "",
                    basePrice: "",
                    customizable: false,
                    materials: "",
                    dimensions: "",
                    images: [],
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
        <div className="w-full max-w-7xl mx-auto pt-6">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mb-8"
            >
                <h1 className="font-display text-3xl md:text-4xl font-bold text-foreground tracking-tight">
                    Add New Product
                </h1>
                <p className="text-muted-foreground mt-2">
                    Fill in the details below to add a new product to your catalog
                </p>
            </motion.div>

            <motion.form
                onSubmit={handleSubmit}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="bg-card p-6 md:p-8 rounded-2xl shadow-lg border border-border"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="space-y-2">
                        <Label htmlFor="name" className="text-sm font-semibold text-foreground">
                            Product Name <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="E.g., Chesterfield Sofa"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category" className="text-sm font-semibold text-foreground">
                            Category <span className="text-destructive">*</span>
                        </Label>
                        <select
                            id="category"
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            required
                            className="flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 transition-colors"
                        >
                            <option value="sofa">Sofa</option>
                            <option value="headboard">Headboard</option>
                            <option value="pillow">Pillow</option>
                            <option value="mattress">Mattress</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="basePrice" className="text-sm font-semibold text-foreground">
                            Base Price (USD) <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id="basePrice"
                            name="basePrice"
                            type="number"
                            step="0.01"
                            min="0"
                            placeholder="E.g., 1299.99"
                            value={formData.basePrice}
                            onChange={handleChange}
                            required
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2 md:col-span-2 lg:col-span-3">
                        <Label htmlFor="description" className="text-sm font-semibold text-foreground">
                            Description <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id="description"
                            name="description"
                            placeholder="Detailed product features and specifications..."
                            value={formData.description}
                            onChange={handleChange}
                            required
                            className="min-h-[120px] resize-none"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="materials" className="text-sm font-semibold text-foreground">
                            Materials
                        </Label>
                        <Input
                            id="materials"
                            name="materials"
                            type="text"
                            placeholder="E.g., Velvet, Oak Wood, Foam"
                            value={formData.materials}
                            onChange={handleChange}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dimensions" className="text-sm font-semibold text-foreground">
                            Dimensions
                        </Label>
                        <Input
                            id="dimensions"
                            name="dimensions"
                            type="text"
                            placeholder="E.g., 80W x 40L x 30H"
                            value={formData.dimensions}
                            onChange={handleChange}
                            className="h-11"
                        />
                    </div>

                    <div className="space-y-3 p-4 border border-border rounded-lg bg-muted/30">
                        <Label className="text-sm font-semibold text-foreground">Customizable?</Label>
                        <div className="flex items-center gap-6">
                            <div className="flex items-center space-x-2">
                                <input
                                    id="customizableTrue"
                                    name="customizable"
                                    type="radio"
                                    checked={formData.customizable === true}
                                    onChange={() => setFormData(prev => ({...prev, customizable: true }))}
                                    className="h-4 w-4 text-primary border-border focus:ring-2 focus:ring-primary cursor-pointer"
                                />
                                <Label htmlFor="customizableTrue" className="text-sm font-normal cursor-pointer">
                                    Yes
                                </Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <input
                                    id="customizableFalse"
                                    name="customizable"
                                    type="radio"
                                    checked={formData.customizable === false}
                                    onChange={() => setFormData(prev => ({...prev, customizable: false }))}
                                    className="h-4 w-4 text-primary border-border focus:ring-2 focus:ring-primary cursor-pointer"
                                />
                                <Label htmlFor="customizableFalse" className="text-sm font-normal cursor-pointer">
                                    No
                                </Label>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2 lg:col-span-3">
                        <Label htmlFor="images" className="text-sm font-semibold text-foreground">
                            Product Images <span className="text-muted-foreground font-normal">(Max 5)</span>
                        </Label>
                        <Input
                            id="images"
                            name="images"
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleImageChange}
                            className="h-11 cursor-pointer file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-primary file:text-primary-foreground hover:file:bg-primary/90 file:cursor-pointer"
                        />
                        {formData.images.length > 0 && (
                            <p className="text-sm text-muted-foreground">
                                {formData.images.length} file{formData.images.length > 1? 's' : ''} selected
                            </p>
                        )}
                    </div>

                    {imagePreviews.length > 0 && (
                        <div className="lg:col-span-3 border border-border rounded-xl p-4 bg-muted/20">
                            <p className="text-sm font-semibold text-foreground mb-3">Image Previews</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                                {imagePreviews.map((src, index) => (
                                    <div key={index} className="relative aspect-square overflow-hidden rounded-lg border border-border group">
                                        <img
                                            src={src}
                                            alt={`Product preview ${index + 1}`}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                <div className="mt-8 flex items-center gap-4">
                    <Button
                        type="submit"
                        size="lg"
                        className="px-8 font-semibold"
                        disabled={isLoading ||!formData.name ||!formData.description ||!formData.basePrice}
                    >
                        {isLoading? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Adding Product...
                            </>
                        ) : "Add Product"}
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        <span className="text-destructive">*</span> Required fields
                    </p>
                </div>
            </motion.form>
        </div>
    );
};

export default AddProduct;