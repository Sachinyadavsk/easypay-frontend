import React from 'react'
import { Link } from 'react-router-dom';
import { useState } from 'react';
import API from '../../shared/api/axios';
import { useNavigate } from 'react-router-dom';

const Register = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const navigate = useNavigate();

    const [form, setForm] = useState({
        name: "",
        phone: "",
        email: "",
        password: "",
    })

    const Handlechange = (e) => {
        // Handle input change logic here
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        })
    }

    const HandleSubmit = async (e) => {
        e.preventDefault()
        // Handle form submission logic here
        try {
            setLoading(true);
            const res = await API.post("/auth/register", form);

            // Redirect to login page after successful registration
            if (res.data.status === "success") {
                setSuccess("Registration successful. Please login.");
                setTimeout(() => {
                    navigate("/login");
                }, 1500);
            } else {
                setError("Registration failed. Please try again.");
            }

        } catch (err) {
            setError("Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }

    }

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-8">

                <div className="text-center mb-10">
                    <div className="w-24 h-24 bg-[#5F259F] rounded-full mx-auto mb-5 flex items-center justify-center text-white text-4xl font-bold">
                        P
                    </div>

                    <h1 className="text-4xl font-bold mb-2">
                        Create Account
                    </h1>

                    <p className="text-gray-500">
                        Register your PhonePe account
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

                <form onSubmit={HandleSubmit}>
                    <div className="space-y-5">
                        <input
                            type="text"
                            name="name"
                            value={form.name}
                            placeholder="Full Name"
                            className="w-full border p-4 rounded-2xl outline-none"
                            onChange={Handlechange}
                        />

                        <input
                            type="text"
                            name="phone"
                            value={form.phone}
                            placeholder="Mobile Number"
                            className="w-full border p-4 rounded-2xl outline-none"
                            onChange={Handlechange}
                        />

                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            placeholder="Email Address"
                            className="w-full border p-4 rounded-2xl outline-none"
                            onChange={Handlechange}
                        />

                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            placeholder="Create Password"
                            className="w-full border p-4 rounded-2xl outline-none"
                            onChange={Handlechange}
                        />

                        <button
                            type="submit"
                            className="w-full bg-[#5F259F] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#4d1f82] transition"
                            disabled={loading}
                        >
                            {loading ? "Registering..." : "Register Now"}
                        </button>
                    </div>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    Already have an account?
                    <Link to="/login" className="text-[#5F259F] font-bold ml-2">
                        Login
                    </Link>
                </p>
            </div>
        </div>
    )
}

export default Register
