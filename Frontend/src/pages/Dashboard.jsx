import { Navbar } from '@/components/Navbar'
import Sidebar from '@/components/Sidebar'
import React from 'react'
import { Outlet } from 'react-router-dom'

const Dashboard = () => {
  return (
    <div className='min-h-screen bg-background'>
      <Navbar />
      <div className='flex pt-10'>
        <Sidebar />
        <main className='flex-1 md:ml-[300px] p-4 md:p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default Dashboard