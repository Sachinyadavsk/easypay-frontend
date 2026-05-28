import React from 'react';
import { FaBell, FaUserCircle } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';
import { LogOut } from "lucide-react";
import API from "../shared/api/axios";

const Navbar = () => {

    const { user, setUser } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="bg-[#5F259F] text-white sticky top-0 z-50 shadow-lg">
            <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">

                {/* Logo */}
                <div>
                    <h1 className="text-2xl font-bold">
                        <Link to="/">Easypay</Link>
                    </h1>
                </div>

                {/* Icons */}
                <div className="flex items-center gap-5 text-2xl">

                    {/* Notifications */}
                    <Link to="/notifications">
                        <FaBell />
                    </Link>

                    {/* Profile/Login */}
                    {user ? (
                        <Link to="/profile">
                            <FaUserCircle />
                        </Link>
                    ) : (
                        <Link to="/mpin/login">
                            <FaUserCircle />
                        </Link>
                    )}

                    {/* Logout */}
                    {user && (
                        <Link to="/users/logout" className="cursor-pointer"> 
                        <LogOut />
                        </Link>
                    )}

                </div>
            </div>
        </header>
    );
};

export default Navbar;