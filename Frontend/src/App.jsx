import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Products from './pages/Products'
import AuthSuccess from './pages/AuthSuccess'
import EmailVerify from './pages/EmailVerify'
import ForgotPassword from './pages/ForgotPassword'
import VerifyOTP from './pages/VerifyOtp'
import ChangePassword from './pages/ChangePassword'
import Profile from './pages/Profile'
import AddProduct from './pages/admin/AddProduct'
import ProductDetails from './pages/ProductDetails'
import Cart from './pages/Cart'
import Dashboard from './pages/Dashboard'
import AdminSales from './pages/admin/AdminSales'
import ShowUserOrders from './pages/admin/ShowUserOrders'
import ProtectedRoute from './components/ProtectedRoute'
import AdminUsers from './pages/admin/AdminUsers'
import AdminProducts from './pages/admin/AdminProducts'
import NotFound from './pages/NotFound'
import AddressForm from './pages/AddressForm'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />
  },
  {
    path: '/signup',
    element: <Signup />
  },
  {
    path: '/login',
    element: <Login />
  },
  {
    path: '/auth-success',
    element: <AuthSuccess />
  },
  {
    path: '/verify/:token',
    element: <EmailVerify />
  },
  {
    path: '/forgotpassword',
    element: <ForgotPassword />
  },
  {
    path: '/verify-otp/:email',
    element: <VerifyOTP />
  },
  {
    path: '/changepassword/:email',
    element: <ChangePassword />
  },
  {
    path: '/products',
    element: <><ProtectedRoute><Products /></ProtectedRoute></>
  },
  {
    path: '/product/:_id',
    element: <><ProtectedRoute><ProductDetails /></ProtectedRoute></>
  },
  {
    path: '/profile/:userId',
    element: <><ProtectedRoute><Profile/></ProtectedRoute></>
  },
  {
    path: '/cart',
    element: <><ProtectedRoute><Cart /></ProtectedRoute></>
  },
  {
    path: '/address',
    element: <><ProtectedRoute><AddressForm /></ProtectedRoute></>
  },
  {
    path: '/dashboard',
    element: <><ProtectedRoute adminOnly={true}><Dashboard /></ProtectedRoute></>,
    children: [
      {
        path: 'add-product',
        element: <AddProduct />
      },
      {
        path: 'sales',
        element: <AdminSales />
      },
      {
        path: 'orders/:userId',
        element: <ShowUserOrders />
      },
      {
        path: 'products',
        element: <AdminProducts />
      },
      {
        path: 'users',
        element: <AdminUsers />
      },
    ]
  },
  {
    path: '*',
    element: <NotFound />
  }
])

const App = () => {
  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
