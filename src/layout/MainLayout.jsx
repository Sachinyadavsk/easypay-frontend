import React from 'react'
import { Outlet } from 'react-router-dom';
import Navbar from "../components/Navbar";
import BottomNav from "../components/BottomNav";

const MainLayout = () => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen pb-24">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  )
}

export default MainLayout
