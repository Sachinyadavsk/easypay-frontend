import React, { useEffect } from 'react';
import API from '../../shared/api/axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../shared/context/AuthContext';

const Logout = () => {
    const { setUser } = useAuth();
    const navigate = useNavigate();

    // ✅ Logout Function
    const logoutUser = async () => {
        try {
            const token = localStorage.getItem("token");

            const res = await API.post(
                "/auth/logout",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (res.data.status === "success") {
                console.log("Logged out successfully");

                // Clear User State
                setUser(null);

                // Clear Local Storage
                localStorage.removeItem("user");
                localStorage.removeItem("token");

                // Redirect User
                setTimeout(() => {
                    navigate("/mpin/login");
                }, 5000);
            } else {
                console.error("Logout failed =>", res.data.message);
            }

        } catch (err) {
            console.error("Logout Error =>", err.response?.data || err);

            // Even if API fails, clear local data
            setUser(null);
            localStorage.removeItem("user");
            localStorage.removeItem("token");
            setTimeout(() => {
                navigate("/mpin/login");
            }, 5000);
        }
    };

    useEffect(() => {
        logoutUser();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center px-4 overflow-hidden relative">
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-72 h-72 bg-indigo-500/20 blur-3xl rounded-full"></div>
            <div className="absolute bottom-0 right-0 w-72 h-72 bg-cyan-500/20 blur-3xl rounded-full"></div>

            {/* Card */}
            <div className="relative z-10 w-full max-w-md">
                <div className="backdrop-blur-xl bg-white/10 border border-white/10 rounded-3xl shadow-2xl p-10 text-center">
                    {/* Loader */}
                    <div className="flex items-center justify-center mb-8">
                        <div className="relative">
                            <div className="w-24 h-24 border-4 border-indigo-500/20 rounded-full"></div>
                            <div className="absolute inset-0 w-24 h-24 border-4 border-transparent border-t-indigo-400 border-r-cyan-400 rounded-full animate-spin"></div>

                            <div className="absolute inset-4 rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 flex items-center justify-center shadow-lg">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    strokeWidth={1.8}
                                    stroke="currentColor"
                                    className="w-8 h-8 text-white"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 9V5.25m0 0L19.5 9m-3.75-3.75H9A3.75 3.75 0 005.25 9v10.5A2.25 2.25 0 007.5 21.75h9A2.25 2.25 0 0018.75 19.5V9"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Text */}
                    <h1 className="text-3xl font-bold text-white mb-3 tracking-tight">
                        Logging You Out
                    </h1>

                    <p className="text-slate-300 text-base leading-relaxed mb-6">
                        Please wait while we securely end your session and protect your account.
                    </p>

                    {/* Animated Dots */}
                    <div className="flex items-center justify-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-bounce"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-2.5 h-2.5 rounded-full bg-pink-400 animate-bounce [animation-delay:0.4s]"></span>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-xs text-slate-500">
                        Secure Logout • Session Protected
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Logout;