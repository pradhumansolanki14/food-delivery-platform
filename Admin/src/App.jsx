import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Orders from './pages/Orders/Orders'
import List from './pages/List/List'
import Add from './pages/Add/Add'
import Dashboard from './pages/Dashboard/Dashboard'
import Login from './pages/Login/Login'
import Coupons from './pages/Coupons/Coupons'
import Users from './pages/Users/Users'
import Settings from './pages/Settings/Settings'
import Categories from './pages/Categories/Categories'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAdmin } from './context/AdminContext'

const App = () => {
  const url = 'http://localhost:4000'
  const { adminToken } = useAdmin()

  if (!adminToken) return (
    <>
      <ToastContainer position="top-right" autoClose={3000} toastClassName="rounded-2xl shadow-card border border-slate-100 font-sans text-sm" />
      <Login />
    </>
  )

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <ToastContainer position="top-right" autoClose={3000} toastClassName="rounded-2xl shadow-card border border-slate-100 font-sans text-sm" />
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-5 sm:p-8">
          <Routes>
            <Route path='/' element={<Navigate to="/dashboard" replace />} />
            <Route path='/dashboard' element={<Dashboard url={url} />} />
            <Route path='/add' element={<Add url={url} />} />
            <Route path='/list' element={<List url={url} />} />
            <Route path='/orders' element={<Orders url={url} />} />
            <Route path='/coupons' element={<Coupons url={url} />} />
            <Route path='/users' element={<Users url={url} />} />
            <Route path='/categories' element={<Categories url={url} />} />
            <Route path='/settings' element={<Settings url={url} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
