import { Navbar } from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='min-h-screen'>
      <Navbar />
      <div className='flex'>
        <Sidebar />
        <div className='w-full ml-auto p-4'>
          <Outlet />
        </div>
      </div>
    </div>
  )
}

export default Dashboard
