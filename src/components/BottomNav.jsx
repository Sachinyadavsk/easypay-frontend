import React from 'react';
import { Link } from "react-router-dom";
import {
    FaHome,
    FaMobileAlt,
    FaGift,
    FaUser,
    FaMoneyBill,
    FaBell,
    FaHistory,
} from "react-icons/fa";

const BottomNav = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-2xl border-t z-50 md:hidden">
            <div className="grid grid-cols-4 text-center py-3">
                <Link to="/" className="flex flex-col items-center text-md font-bold">
                    <FaHome size={28} color="#5F259F" />
                    Home
                </Link>

                <Link to="/transfer" className="flex flex-col items-center text-md font-bold">
                    <FaMoneyBill size={28} color="#5F259F" />
                    Pay
                </Link>

                <Link to="/notifications" className="flex flex-col items-center text-md font-bold">
                    <FaBell  size={28} color="#5F259F" />
                    Alerts
                </Link>

                <Link to="/transactions" className="flex flex-col items-center text-md font-bold">
                    <FaHistory size={28} color="#5F259F" />
                    History
                </Link>
            </div>
        </div>
    )
}

export default BottomNav
