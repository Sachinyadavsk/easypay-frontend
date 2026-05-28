import React, { useState } from 'react';
import { Lock, PhoneCall, ShieldCheck } from 'lucide-react';
import API from "../../shared/api/axios";
import { useAuth } from "../../shared/context/AuthContext.jsx";
import { Link, useNavigate } from 'react-router-dom';

const MpinLogin = () => {
    const [mpin, setMpin] = useState('');
    const [phone, setPhone] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);
    const { setUser } = useAuth();
    const navigate = useNavigate();

    // MPIN Change
    const handleMpinChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 4) {
            setMpin(value);
            setError('');
        }
    };

    // Phone Change
    const handlePhoneChange = (e) => {
        const value = e.target.value.replace(/\D/g, '');
        if (value.length <= 10) {
            setPhone(value);
            setError('');
        }
    };

    // Submit Login
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (phone.length !== 10) {
            return setError('Please enter valid phone number');
        }
        if (mpin.length !== 4) {
            return setError('Please enter valid 4-digit MPIN');
        }
        try {
            setLoading(true);
            setError("");
            setSuccess("");
            const res = await API.post('/auth/login-mpin', {
                phone,
                mpin
            });

            if (res.data.status === 'success') {
                // Save User
                localStorage.setItem(
                    'user',
                    JSON.stringify(res.data.user)
                );

                // Save Token
                localStorage.setItem(
                    'token',
                    res.data.token
                );

                setUser(res.data.user);
                setSuccess("Login successful!");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            } else {
                navigate("/mpin/login");
            }

        } catch (err) {
            setError(
                err?.response?.data?.message ||
                'Login failed'
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-700 to-indigo-900 flex items-center justify-center px-4">

            <div className="bg-white w-full max-w-sm rounded-3xl shadow-2xl p-8">

                {/* Header */}
                <div className="flex flex-col items-center mb-6">

                    <div className="bg-purple-100 p-4 rounded-full mb-4">
                        <ShieldCheck className="w-10 h-10 text-purple-700" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-800">
                        MPIN Login
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm text-center">
                        Login using Phone Number & MPIN
                    </p>

                </div>
                {/* Error */}
                {error && (
                    <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-5 text-center">
                        {error}
                    </div>
                )}
                {/* Success */}
                {success && (
                    <div className="bg-green-100 text-green-600 p-4 rounded-2xl mb-5 text-center">
                        {success}
                    </div>
                )}

                {/* Form */}
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >

                    {/* Phone */}
                    <div>

                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Phone Number
                        </label>

                        <div className="relative">

                            <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                            <input
                                type="tel"
                                inputMode="numeric"
                                value={phone}
                                onChange={handlePhoneChange}
                                placeholder="9876543210"
                                className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-3 text-center text-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    {/* MPIN */}
                    <div>

                        <label className="text-sm font-medium text-gray-700 mb-2 block">
                            MPIN
                        </label>

                        <div className="relative">

                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />

                            <input
                                type="password"
                                inputMode="numeric"
                                maxLength={4}
                                value={mpin}
                                onChange={handleMpinChange}
                                placeholder="••••"
                                className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-3 text-center tracking-[12px] text-xl focus:outline-none focus:ring-2 focus:ring-purple-600"
                            />

                        </div>

                    </div>

                    {/* Button */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-purple-700 hover:bg-purple-800 transition-all text-white py-3 rounded-2xl font-semibold shadow-lg disabled:opacity-70"
                    >
                        {loading ? 'Please wait...' : 'Login'}
                    </button>

                </form>

                {/* Forgot */}
                <div className="mt-6 text-center">
                    <button className="text-sm text-purple-700 hover:underline">
                        Forgot MPIN?
                    </button>
                </div>

                {/* Login */}
                <div className="mt-4 text-center">
                    <Link
                        to="/login"
                        className="text-sm text-purple-700 hover:underline"
                    >
                        Login with Email/Password
                    </Link>
                </div>

                {/* Register */}
                <div className="mt-2 text-center">
                    <Link
                        to="/register"
                        className="text-sm text-purple-700 hover:underline"
                    >
                        Don't have an account? Register
                    </Link>
                </div>

            </div>

        </div>
    );
};

export default MpinLogin;