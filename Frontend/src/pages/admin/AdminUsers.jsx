import React, { useEffect, useState, useMemo } from 'react'
import { toast } from 'sonner'
import axios from "axios"
import { Loader, User, Mail, Shield, Search, X, Edit3, Trash2, Save, Loader2, Phone, MapPin, Hash } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
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

const SearchBar = ({ searchValue, setSearchValue }) => {
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') setSearchValue('')
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [setSearchValue])

  return (
    <div className="relative w-full max-w-md mb-8">
      <motion.div className="relative flex items-center bg-white/50 backdrop-blur-md border border-border rounded-2xl overflow-hidden transition-all hover:border-primary/50 shadow-sm focus-within:shadow-md">
        <Search className="absolute left-4 w-5 h-5 text-muted-foreground pointer-events-none" />
        <Input
          type="text"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          placeholder="Search members..."
          className="w-full py-7 pl-12 pr-12 bg-transparent text-foreground placeholder:text-muted-foreground border-none focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="absolute right-3 flex items-center gap-2">
          <AnimatePresence>
            {searchValue && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearchValue("")}
                className="p-1.5 hover:bg-muted rounded-full transition-colors"
                type="button"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  )
}

const AdminUsers = () => {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isActionLoading, setIsActionLoading] = useState(null)
  const [selectedUser, setSelectedUser] = useState(null)
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    role: "",
    phoneNo: "",
    address: "",
    city: "",
    pincode: "",
  })

  const getUsers = async () => {
    try {
      setLoading(true)
      const res = await axios.get("http://localhost:5000/api/users/allusers", {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      if (res.data.success) setUsers(res.data.users)
    } catch (error) {
      toast.error(error.response?.data?.error || "Failed to fetch users")
    } finally {
      setLoading(false)
    }
  }

  const handleStartEdit = (user) => {
    setSelectedUser(user._id)
    setEditFormData({
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      role: user.role || "user",
      phoneNo: user.phoneNo || "",
      address: user.address || "",
      city: user.city || "",
      pincode: user.pincode || "",
    })
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setEditFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleUpdateUser = async (e) => {
    e.preventDefault()
    setIsActionLoading(selectedUser)
    try {
      const res = await axios.put(`http://localhost:5000/api/users/updateprofile/${selectedUser}`, editFormData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      if (res.data.success) {
        toast.success("User profile updated successfully")
        setUsers(users.map(u => u._id === selectedUser ? res.data.user : u))
        setSelectedUser(null)
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user")
    } finally {
      setIsActionLoading(null)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm("Are you sure you want to delete this user?")) return
    setIsActionLoading(userId)
    try {
      const res = await axios.delete(`http://localhost:5000/api/users/deleteuser/${userId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
      })
      if (res.data.success) {
        toast.success("User deleted")
        setUsers(users.filter(u => u._id !== userId))
      }
    } catch (error) {
      toast.error("Deletion failed")
    } finally {
      setIsActionLoading(null)
    }
  }

  useEffect(() => { getUsers() }, [])

  const filteredUsers = useMemo(() => {
    if (!searchValue.trim()) return users
    const query = searchValue.toLowerCase()
    return users.filter(user =>
      user.firstName?.toLowerCase().includes(query) ||
      user.lastName?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query) ||
      user.role?.toLowerCase().includes(query)
    )
  }, [users, searchValue])

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4">
        <Loader className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Loading Directory...</p>
      </div>
    )
  }

  return (
    <div className="p-8">
      <header className="mb-10">
        <h1 className="text-4xl text-primary font-display font-bold tracking-tight">User Directory</h1>
        <p className='text-muted-foreground font-medium mt-1'>View and Manage showroom members.</p>
      </header>

      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {filteredUsers.map((user) => (
          <motion.div
            layout
            key={user._id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="group relative bg-[#FCFCFC] rounded-[2.5rem] p-8 border border-border/40 shadow-soft hover:shadow-2xl transition-all duration-500"
          >
            {/* Hover Actions */}
            <div className="absolute inset-0 bg-charcoal/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20 rounded-[2.5rem] backdrop-blur-[2px]">
              <Dialog onOpenChange={(open) => !open && setSelectedUser(null)}>
                <DialogTrigger asChild>
                  <button 
                    onClick={() => handleStartEdit(user)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-charcoal rounded-full text-xs font-bold uppercase tracking-widest shadow-xl hover:bg-primary hover:text-white transition-all active:scale-95"
                  >
                    <Edit3 size={14} /> Edit
                  </button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[550px] rounded-[2rem] max-h-[90vh] overflow-y-auto">
                  <form onSubmit={handleUpdateUser}>
                    <DialogHeader>
                      <DialogTitle className="font-display text-2xl">User Profile Editor</DialogTitle>
                      <DialogDescription>Update official details for {user.firstName}.</DialogDescription>
                    </DialogHeader>

                    <div className="grid grid-cols-2 gap-4 py-6">
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">First Name</Label>
                        <Input name="firstName" value={editFormData.firstName} onChange={handleInputChange} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Last Name</Label>
                        <Input name="lastName" value={editFormData.lastName} onChange={handleInputChange} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Access Level</Label>
                        <select 
                          name="role"
                          value={editFormData.role}
                          onChange={handleInputChange}
                          className="w-full h-10 rounded-xl border border-input bg-background px-3 text-sm outline-none focus:ring-2 focus:ring-primary"
                        >
                          <option value="user">Standard User</option>
                          <option value="admin">Administrator</option>
                        </select>
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Phone Number</Label>
                        <Input name="phoneNo" value={editFormData.phoneNo} onChange={handleInputChange} className="rounded-xl" />
                      </div>
                      <div className="space-y-2 col-span-2">
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Street Address</Label>
                        <Input name="address" value={editFormData.address} onChange={handleInputChange} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">City</Label>
                        <Input name="city" value={editFormData.city} onChange={handleInputChange} className="rounded-xl" />
                      </div>
                      <div className="space-y-2">
                        <Label className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">Pincode</Label>
                        <Input name="pincode" value={editFormData.pincode} onChange={handleInputChange} className="rounded-xl" />
                      </div>
                    </div>

                    <DialogFooter>
                      <Button 
                        type="submit" 
                        disabled={isActionLoading === user._id}
                        className="rounded-xl gradient-primary w-full h-12 shadow-lg"
                      >
                        {isActionLoading === user._id ? <Loader2 className="animate-spin mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                        Save Member Profile
                      </Button>
                    </DialogFooter>
                  </form>
                </DialogContent>
              </Dialog>

              <button 
                onClick={() => handleDeleteUser(user._id)}
                disabled={isActionLoading === user._id}
                className="p-3 bg-white/90 text-destructive rounded-full shadow-xl hover:bg-destructive hover:text-white transition-all active:scale-95 disabled:opacity-50"
              >
                {isActionLoading === user._id ? <Loader2 size={18} className="animate-spin" /> : <Trash2 size={18} />}
              </button>
            </div>
            <div className="relative flex flex-col items-center text-center">
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-primary/10 blur-2xl rounded-full scale-150 opacity-0 group-hover:opacity-100 transition-opacity" />
                {user.profilePic ? (
                  <img src={user.profilePic} alt="" className="relative w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl" />
                ) : (
                  <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border-4 border-white shadow-xl">
                    <User className="w-10 h-10 text-primary" />
                  </div>
                )}
                {user.role === 'admin' && (
                   <div className="absolute -bottom-1 -right-1 bg-primary text-white p-1.5 rounded-full shadow-lg border-2 border-white">
                      <Shield size={14} />
                   </div>
                )}
              </div>

              <h3 className="text-xl font-display font-bold text-charcoal mb-1 truncate w-full">
                {user.firstName} {user.lastName}
              </h3>
              
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-6">
                <Mail size={14} className="opacity-60" />
                <span className="truncate max-w-[150px] italic">{user.email}</span>
              </div>

              <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                user.role === 'admin' 
                  ? 'bg-primary/10 text-primary border-primary/20' 
                  : 'bg-muted text-muted-foreground border-border'
              }`}>
                {user.role || 'User'}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export default AdminUsers