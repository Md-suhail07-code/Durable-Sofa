import { Edit, LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='hidden md:block fixed left-0 top-16 w-[300px] h-[calc(100vh-4rem)] bg-primary/10 border-r border-border p-6 overflow-y-auto'>
      <div className='flex flex-col space-y-2'>
        <NavLink to='/dashboard/sales' className={({ isActive }) => isActive? 'bg-primary w-full py-3 px-5 rounded-lg flex items-center gap-3 text-white font-semibold' : 'hover:bg-primary/20 hover:text-foreground w-full py-3 px-5 rounded-lg flex items-center gap-3 text-muted-foreground font-medium transition-colors'}>
            <LayoutDashboard size={20} />
            <span>Dashboard</span>
        </NavLink>
        <NavLink to='/dashboard/add-product' className={({ isActive }) => isActive? 'bg-primary w-full py-3 px-5 rounded-lg flex items-center gap-3 text-white font-semibold' : 'hover:bg-primary/20 hover:text-foreground w-full py-3 px-5 rounded-lg flex items-center gap-3 text-muted-foreground font-medium transition-colors'}>
            <PackagePlus size={20} />
            <span>Add Product</span>
        </NavLink>
        <NavLink to='/dashboard/products' className={({ isActive }) => isActive? 'bg-primary w-full py-3 px-5 rounded-lg flex items-center gap-3 text-white font-semibold' : 'hover:bg-primary/20 hover:text-foreground w-full py-3 px-5 rounded-lg flex items-center gap-3 text-muted-foreground font-medium transition-colors'}>
            <PackageSearch size={20} />
            <span>Products</span>
        </NavLink>
        <NavLink to='/dashboard/orders/:userId' className={({ isActive }) => isActive? 'bg-primary w-full py-3 px-5 rounded-lg flex items-center gap-3 text-white font-semibold' : 'hover:bg-primary/20 hover:text-foreground w-full py-3 px-5 rounded-lg flex items-center gap-3 text-muted-foreground font-medium transition-colors'}>
            <Edit size={20} />
            <span>Orders</span>
        </NavLink>
        <NavLink to='/dashboard/users' className={({ isActive }) => isActive? 'bg-primary w-full py-3 px-5 rounded-lg flex items-center gap-3 text-white font-semibold' : 'hover:bg-primary/20 hover:text-foreground w-full py-3 px-5 rounded-lg flex items-center gap-3 text-muted-foreground font-medium transition-colors'}>
            <Users size={20} />
            <span>Users</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar