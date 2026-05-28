import { useEffect, useState } from "react";
import { useAuth } from "../../shared/context/AuthContext.jsx";
import API from "../../shared/api/axios";
import {
    FaWallet,
    FaMobileAlt,
    FaUniversity,
    FaQrcode,
    FaGift,
    FaBell,
    FaArrowUp,
    FaArrowDown,
} from "react-icons/fa";
import WalletCard from '../WalletCard';
import ServiceCard from "../ServiceCard";
import quickActions from '../../static-api/transfers.jsx';
import sliderData from '../../static-api/sliderData.jsx';
import services from '../../static-api/ServiceData.jsx';
import { Link } from "react-router-dom";
import TravelData from "../../static-api/TravelData.jsx";


const Dashboard = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);

    // using  the service api to fetch the services and display on the home page
    //  set condition where if user is not logged in, redirect to login page button and link click check login status and if not logged in, redirect to login page
    // only button click and link click check login status and if not logged in, redirect to login page all features display but when click on any feature check login status and if not logged in, redirect to login page
    const handleFeatureClick = (link, button) => {
        if (!user) {
            alert("Please login to access this feature.");
            window.location.href = "/mpin/login";
        } else {
            window.location.href = link;
        }
    }

    if (!user) {
        return <p className="p-6">Loading profile...</p>;
    }
    return (
        <div className="bg-gray-100 min-h-screen pb-24">
            {/* Top Header */}
            <div className="bg-gradient-to-r">
                <div className="max-w-7xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h1 className="text-3xl font-bold">
                                Hello {user.name} 👋
                            </h1>
                            <p className="text-black mt-1">
                                Welcome Back
                            </p>
                        </div>
                    </div>
                    {/* Wallet Card */}
                    <WalletCard userdetails={user} />
                </div>

            </div>

            <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Quick Actions */}
                <div className="bg-white rounded-[35px] shadow-xl p-6 md:p-8">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-bold">
                            Money Transfers
                        </h2>

                        <button onClick={() => handleFeatureClick("/transfer-to-mobile", "View All")} className="text-[#5F259F] font-bold">
                            View All
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {quickActions.map((item, index) => (
                            <Link to={item.link} key={index} onClick={() => handleFeatureClick(item.link, item.title)}>
                                <div
                                    key={index}
                                    className="bg-gray-100 rounded-3xl p-6 text-center hover:shadow-lg transition cursor-pointer"
                                >
                                    <div className="w-20 h-20 rounded-full bg-[#5F259F] text-white flex items-center justify-center mx-auto text-4xl mb-4 shadow-lg">
                                        {item.icon}
                                    </div>

                                    <h3 className="font-bold text-lg leading-snug">
                                        {item.title}
                                    </h3>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Recharge & Bill Payments */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold">
                            Recharge & Pay Bills
                        </h2>

                        <button onClick={() => handleFeatureClick("/recharge", "More")} className="text-[#5F259F] font-bold">
                            More
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {services.length > 0 ? (
                            services.map((ser, index) => (
                                <ServiceCard
                                    key={index}
                                    link={ser.link}
                                    onClick={() => handleFeatureClick(ser.link, ser.title)}
                                    icon={ser.icon}
                                    title={ser.title}
                                />
                            ))
                        ) : (
                            <p>No services available.</p>
                        )}
                    </div>
                </div>

                {/* /*  Travel & Tickets */}
                <div>
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-3xl font-bold">
                            Travel & Tickets
                        </h2>

                        <button onClick={() => handleFeatureClick("/recharge", "More")} className="text-[#5F259F] font-bold">
                            More
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        {TravelData.length > 0 ? (
                            TravelData.map((ser, index) => (
                                <ServiceCard
                                    key={index}
                                    link={ser.link}
                                    onClick={() => handleFeatureClick(ser.link, ser.title)}
                                    icon={ser.icon}
                                    title={ser.title}
                                />
                            ))
                        ) : (
                            <p>No services available.</p>
                        )}
                    </div>
                </div>

                {/* Cashback Banner */}
                <div className="bg-gradient-to-r from-pink-500 to-orange-400 rounded-[35px] p-8 text-white shadow-2xl">
                    <div className="grid lg:grid-cols-2 gap-8 items-center">
                        <div>
                            <h2 className="text-4xl font-bold mb-4">
                                Win Daily Cashback 🎁
                            </h2>

                            <p className="text-lg text-gray-100 leading-relaxed mb-6">
                                Recharge and pay bills to earn exciting rewards and cashback offers.
                            </p>

                            <button onClick={() => handleFeatureClick("/cashback", "Explore Offers")} className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-bold shadow-lg">
                                Explore Rewards
                            </button>
                        </div>

                        <div className="text-center text-9xl">
                            🎉
                        </div>
                    </div>
                </div>



                {/* Slider */}
                <div className="grid md:grid-cols-3 gap-6">
                    {sliderData.map((slide, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-r from-[#5F259F] to-[#7E3AF2] rounded-3xl p-8 text-white shadow-xl"
                        >
                            <h2 className="text-3xl font-bold mb-4">
                                {slide.title}
                            </h2>

                            <p className="text-lg text-gray-100 leading-relaxed">
                                {slide.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
                        <h3 className="text-4xl font-bold text-[#5F259F]">
                            ₹25K
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Monthly Spend
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
                        <h3 className="text-4xl font-bold text-[#5F259F]">
                            150+
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Transactions
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
                        <h3 className="text-4xl font-bold text-[#5F259F]">
                            ₹2,500
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Cashback Earned
                        </p>
                    </div>

                    <div className="bg-white rounded-3xl p-6 shadow-lg text-center">
                        <h3 className="text-4xl font-bold text-[#5F259F]">
                            VIP
                        </h3>
                        <p className="text-gray-500 mt-2">
                            Premium User
                        </p>
                    </div>
                </div>


                {/* Rewards Card */}
                <div className="bg-gradient-to-r from-[#5F259F] to-[#7E3AF2] rounded-[35px] p-8 text-white shadow-2xl flex flex-col md:flex-row items-center justify-between gap-8">
                    <div>
                        <h2 className="text-4xl font-bold mb-4">
                            Super Rewards
                        </h2>

                        <p className="text-lg text-gray-100 leading-relaxed max-w-xl">
                            Complete tasks, make payments and unlock premium cashback rewards.
                        </p>
                    </div>

                    <div className="text-8xl">
                        <FaGift />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
