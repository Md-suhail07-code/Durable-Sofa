import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, LogOut, Upload } from "lucide-react";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "@/redux/userSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { setUser } from "@/redux/userSlice";
import { API_URL } from "@/config";

const defaultData = {
    firstName: "User",
    lastName: "",
    email: "",
    phoneNo: "",
    address: "",
    city: "",
    pincode: "",
    profilePic: "",
    role: "user"
};

const Profile = () => {
    const userState = useSelector((state) => state.user);
    const user = userState.user || {};
    const isAuthenticated = !!user.email;

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userData = isAuthenticated ? user : defaultData;

    const [updateUser, setUpdateUser] = useState({
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phoneNo: userData.phoneNo || '',
        address: userData.address || '',
        city: userData.city || '',
        pincode: userData.pincode || '',
        profilePic: userData.profilePic || '',
        role: userData.role || 'user',
    });

    const [file, setFile] = useState(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleChange = (e) => {
        setUpdateUser({ ...updateUser, [e.target.name]: e.target.value });
    }

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setUpdateUser({ ...updateUser, profilePic: URL.createObjectURL(selectedFile) });
        }
    }

    const getUserProfile = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            const res = await axios.get(`${API_URL}/api/users/users/me/${userData._id}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (res.data.success) {
                setUpdateUser(res.data.user);
                dispatch(setUser(res.data.user));
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to fetch user profile.");
            console.error("Get User Profile Error:", error);
        }
    }

    useEffect(() => {
        getUserProfile();
    }, [userData._id], dispatch, setUpdateUser);

    const handleSaveProfile = async (e, type) => {
        e.preventDefault();
        setIsSaving(true);

        const accessToken = localStorage.getItem('accessToken');

        try {
            const formData = new FormData();
            formData.append('firstName', updateUser.firstName);
            formData.append('lastName', updateUser.lastName);
            formData.append('phoneNo', updateUser.phoneNo);
            formData.append('address', updateUser.address);
            formData.append('city', updateUser.city);
            formData.append('pincode', updateUser.pincode);

            if (file) {
                formData.append('file', file);
            }

            const res = await axios.put(`${API_URL}/api/users/updateprofile/${userData._id}`, formData, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (res.data.success) {
                toast.success(res.data.message || `${type} updated successfully.`);
                dispatch(setUser(res.data.user));
                setFile(null);
            }
            else {
                toast.error(res.data.message || `${type} update failed.`);
            }

        } catch (error) {
            console.error("Save Profile Error:", error);
            const errorMessage = error.response?.data?.message || `An error occurred during ${type} update.`;
            toast.error(errorMessage);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDeleteProfilePic = async () => {
        try {
            setIsSaving(true);
            const accessToken = localStorage.getItem('accessToken');
            const userId = userData._id;

            const res = await axios.delete(`${API_URL}/api/users/deleteprofilepic/${userId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });

            if (res.data.success) {
                toast.success(res.data.message || "Profile picture deleted successfully.");
                dispatch(setUser(res.data.user));
            } else {
                toast.error(res.data.message || "Failed to delete profile picture.");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "An error occurred while deleting profile picture.");
            console.error("Delete Profile Picture Error:", error);
        }
        finally {
            setIsSaving(false);
        }
    }


    const handleSignOut = async (e) => {
        e.preventDefault();
        dispatch(logoutUser());

        try {
            const res = await axios.post(`${API_URL}/api/users/logout`, {}, {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("accessToken")}`
                }
            });

            if (res.data && res.data.success) {
                navigate('/')
                toast.success("Logged out successfully!");
            } else {
                toast.error(res.data.message || "Logout failed at the server.");
            }
        } catch (error) {
            console.error("Logout Error:", error);
            toast.error("Error logging out. Please refresh.", {
                description: "Client state cleared."
            });
        }
    };


    if (!isAuthenticated) {
        return (
            <div className="pt-32 pb-20 container mx-auto px-6 text-center">
                <h1 className="text-3xl font-display text-destructive">Access Denied</h1>
                <p className="text-muted-foreground mt-4">Please log in to view your profile.</p>
                <Link to="/login">
                    <Button variant="glow" className="mt-6">Go to Login</Button>
                </Link>
            </div>
        );
    }

    const renderProfileImage = () => {
        if (updateUser.profilePic) {
            return (
                <img
                    src={updateUser.profilePic}
                    alt={`${userData.firstName}'s Profile`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-primary shadow-medium mx-auto mb-4"
                />
            );
        }
        return (
            <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 border border-primary/20">
                <User className="w-12 h-12 text-primary" />
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-32 pb-20">
                <div className="container mx-auto px-6 max-w-7xl">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-12">
                            Welcome, {userData.firstName}!
                        </h1>

                        <div className="grid lg:grid-cols-3 gap-8">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5, delay: 0.1 }}
                                className="bg-card rounded-2xl border border-border shadow-soft p-8"
                            >
                                {renderProfileImage()}

                                <h2 className="font-display text-2xl font-semibold text-foreground mb-1">
                                    {userData.firstName} {userData.lastName}
                                </h2>
                                <p className="text-sm text-primary mb-6">{userData.email}</p>

                                <div className="flex flex-row items-center justify-center gap-4">
                                    <Button
                                        variant="glow"
                                        className="w-full gap-2 relative overflow-hidden"
                                        disabled={isSaving}
                                    >
                                        <Upload className="w-4 h-4" />
                                        {file ? 'Change Photo' : 'Upload Photo'}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                            onChange={handleFileChange}
                                            disabled={isSaving}
                                        />
                                    </Button>
                                    <Button 
                                        variant="danger" 
                                        onClick={handleDeleteProfilePic} 
                                        className="w-full gap-2 relative overflow-hidden"
                                        disabled={isSaving}
                                    >
                                        {isSaving ? "Deleting..." : "Delete Photo"}
                                    </Button>
                                </div>

                                <Button
                                    variant="outline"
                                    className="w-full gap-2 mt-4 hover:bg-primary hover:text-white"
                                    onClick={handleSignOut}
                                >
                                    <LogOut className="w-4 h-4" />
                                    Sign Out
                                </Button>
                            </motion.div>

                            <motion.form
                                onSubmit={(e) => handleSaveProfile(e, 'Personal Info')}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: 0.2 }}
                                className="lg:col-span-2 bg-card rounded-2xl border border-border shadow-soft p-8 space-y-8"
                            >
                                <h3 className="font-display text-2xl font-semibold text-foreground mb-6">
                                    Personal Information
                                </h3>

                                <div className="grid md:grid-cols-2 gap-6">
                                    {/* First Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            First Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                name="firstName"
                                                value={updateUser.firstName}
                                                onChange={handleChange}
                                                className="pl-11 bg-input border-border"
                                            />
                                        </div>
                                    </div>
                                    {/* Last Name */}
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Last Name
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                name="lastName"
                                                value={updateUser.lastName}
                                                onChange={handleChange}
                                                className="pl-11 bg-input border-border"
                                            />
                                        </div>
                                    </div>
                                    {/* Email */}
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Email (Read-Only)
                                        </label>
                                        <div className="relative">
                                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                name="email"
                                                value={updateUser.email}
                                                disabled
                                                className="pl-11 bg-muted border-border"
                                            />
                                        </div>
                                    </div>
                                    {/* Phone */}
                                    <div>
                                        <label className="block text-sm font-medium text-muted-foreground mb-2">
                                            Phone
                                        </label>
                                        <div className="relative">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                            <Input
                                                type="tel"
                                                name="phoneNo"
                                                placeholder="Enter your phone number"
                                                value={updateUser.phoneNo}
                                                onChange={handleChange}
                                                className="pl-11 bg-input border-border"
                                            />
                                        </div>
                                    </div>
                                </div>
                                {/* Shipping Address */}
                                <div>
                                    <h3 className="font-display text-2xl font-semibold text-foreground mb-6 flex items-center gap-3">
                                        <MapPin className="w-6 h-6 text-primary" />
                                        Shipping Address
                                    </h3>

                                    <div className="grid md:grid-cols-2 gap-6">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                Street Address
                                            </label>
                                            <Input
                                                name="address"
                                                value={updateUser.address}
                                                onChange={handleChange}
                                                className="bg-input border-border"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                City
                                            </label>
                                            <Input
                                                name="city"
                                                value={updateUser.city}
                                                onChange={handleChange}
                                                className="bg-input border-border"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                PIN Code
                                            </label>
                                            <Input
                                                name="pincode"
                                                value={updateUser.pincode}
                                                onChange={handleChange}
                                                className="bg-input border-border"
                                            />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-muted-foreground mb-2">
                                                Country (Read-Only)
                                            </label>
                                            <Input defaultValue="India" disabled className="bg-muted border-border" />
                                        </div>
                                    </div>

                                    <Button type="submit" variant="glow" className="mt-6 font-semibold" disabled={isSaving}>
                                        {isSaving ? "Saving Changes..." : "Save Changes"}
                                    </Button>
                                </div>
                            </motion.form>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default Profile;