import { Edit, LayoutDashboard, PackagePlus, PackageSearch, Users } from 'lucide-react'
import React from 'react'
import { NavLink } from 'react-router-dom'

const Sidebar = () => {
  return (
    <div className='hidden fixed md:block w-[300px] bg-primary/10 h-screen p-10 mt-10'>
      <div className='flex flex-col pt-3 px-3 space-y-2 text-center'>
        <NavLink to='/dashboard/sales' className={({ isActive }) => isActive ? 'bg-primary w-full py-3 px-5 rounded-lg flex items-center gap-2 text-white font-semibold' : 'hover:bg-primary hover:text-white w-full py-3 px-5 rounded-lg flex items-center gap-2 text-gray-700 font-semibold'}>
            <LayoutDashboard />
            <span>Dashboard</span>
        </NavLink>
        <NavLink to='/dashboard/add-product' className={({ isActive }) => isActive ? 'bg-primary w-full py-3 px-5 rounded-lg flex items-center gap-2 text-white font-semibold' : 'hover:bg-primary hover:text-white w-full py-3 px-5 rounded-lg flex items-center gap-2 text-gray-700 font-semibold'}>
            <PackagePlus />
            <span>Add Product</span>
        </NavLink>
        <NavLink to='/dashboard/products' className={({ isActive }) => isActive ? 'bg-primary w-full py-3 px-5 rounded-lg flex items-center gap-2 text-white font-semibold' : 'hover:bg-primary hover:text-white w-full py-3 px-5 rounded-lg flex items-center gap-2 text-gray-700 font-semibold'}>
            <PackageSearch />
            <span>Products</span>
        </NavLink>
        <NavLink to='/dashboard/orders/:userId' className={({ isActive }) => isActive ? 'bg-primary w-full py-3 px-5 rounded-lg flex items-center gap-2 text-white font-semibold' : 'hover:bg-primary hover:text-white w-full py-3 px-5 rounded-lg flex items-center gap-2 text-gray-700 font-semibold'}>
            <Edit />
            <span>Orders</span>
        </NavLink>
        <NavLink to='/dashboard/users' className={({ isActive }) => isActive ? 'bg-primary w-full py-3 px-5 rounded-lg flex items-center gap-2 text-white font-semibold' : 'hover:bg-primary hover:text-white w-full py-3 px-5 rounded-lg flex items-center gap-2 text-gray-700 font-semibold'}>
            <Users />
            <span>Users</span>
        </NavLink>
      </div>
    </div>
  )
}

export default Sidebar
