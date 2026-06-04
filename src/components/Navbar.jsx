import React, { useState } from 'react'
import { FaBell, FaQq, FaUserCircle } from 'react-icons/fa'
import { Link, useNavigate } from 'react-router-dom'
import {
    CreditCard,
    Repeat,
    ShoppingBag,
    HelpCircle,
    Gift,
    Settings,
    ChevronRight,
    LogOut,
    User,
    X,
} from 'lucide-react'

import { useAuth } from '../shared/context/AuthContext';
import menuItems from '../static-api/menuItems';

const Navbar = () => {
    const { user, setUser } = useAuth();
    const navigate = useNavigate()
    const [showProfileMenu, setShowProfileMenu] = useState(false)
    const notificationCount = 3 // Dynamic API Count
    
    return (
        <>
            <header className="bg-[#5F259F] text-white sticky top-0 z-40 shadow-lg">
                <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
                    {/* LOGO */}
                    <Link to="/" className="text-2xl font-bold">Easypay</Link>
                    {/* RIGHT MENU */}
                    <div className="flex items-center gap-5 text-2xl">
                        {/* NOTIFICATIONS */}
                        {user ? (
                            <Link
                                to="/notifications"
                                className="relative"
                            >
                                <FaBell />

                                {notificationCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-semibold">
                                        {notificationCount}
                                    </span>
                                )}
                            </Link>
                        ) : (
                            <Link to="/faqs">
                                <FaQq />
                            </Link>
                        )}

                        {user ? (
                            <button onClick={() => setShowProfileMenu(true)}>
                                <FaUserCircle />
                            </button>
                        ) : (
                            <Link to="/mpin/login">
                                <FaUserCircle />
                            </Link>
                        )}

                        {/* PROFILE */}

                    </div>
                </div>
            </header>



            {/* DRAWER */}
            {showProfileMenu && (
                <>
                    {/* OVERLAY */}
                    <div onClick={() => setShowProfileMenu(false)} className="fixed inset-0 bg-black/40 z-50"
                    />

                    {/* SIDEBAR */}
                    <div className="fixed top-0 right-0 w-[90%] max-w-sm h-screen bg-white z-50 shadow-2xl overflow-y-auto">
                        {/* HEADER */}
                        <div className="bg-[#5F259F] text-white p-5">
                            <div className="flex justify-between items-start">
                                <div className="flex gap-3">
                                    <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center">
                                        <FaUserCircle size={32} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-lg">{user?.name || 'Guest User'}</h3>
                                        <p className="text-sm text-white/80">
                                            {user?.mobile || user?.email || 'Welcome'}
                                        </p>
                                    </div>
                                </div>

                                <button onClick={() => setShowProfileMenu(false)}><X /></button>
                            </div>
                        </div>

                        {/* WALLET CARD */}
                        {user && (
                            <div className="m-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-3xl p-5 shadow-lg">
                                <p className="text-sm opacity-80">Wallet Balance</p>
                                <h3 className="text-3xl font-bold mt-2">
                                    ₹{Number(user?.balance || 0).toFixed(2)}
                                </h3>

                            </div>
                        )}


                        <div className="px-4 pb-8 space-y-2">
                            {user && (
                                <>
                                    {menuItems.map((item, index) => {
                                        const Icon = item.icon

                                        return (
                                            <Link
                                                key={index}
                                                to={item.path}
                                                onClick={() => setShowProfileMenu(false)}
                                                className="flex items-center justify-between p-4 rounded-2xl hover:bg-gray-50 transition"
                                            >
                                                <div className="flex gap-3">
                                                    <Icon className={item.color} />

                                                    <div>
                                                        <h4 className="font-semibold">
                                                            {item.title}
                                                        </h4>

                                                        <p className="text-xs text-gray-500">
                                                            {item.desc}
                                                        </p>
                                                    </div>
                                                </div>

                                                <ChevronRight size={18} />
                                            </Link>
                                        )
                                    })}

                                    <button
                                        onClick={() => {
                                            setShowProfileMenu(false)
                                            navigate('/users/logout')
                                        }}
                                        className="w-full mt-4 bg-red-50 hover:bg-red-100 text-red-600 rounded-2xl p-4 flex items-center gap-3 font-semibold transition"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </>
            )}
        </>
    )
}

export default Navbar