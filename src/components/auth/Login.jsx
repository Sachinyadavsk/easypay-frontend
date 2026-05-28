import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../../shared/api/axios";
import { useAuth } from "../../shared/context/AuthContext.jsx";

const Login = () => {

    const navigate = useNavigate();
    const { setUser } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    // Handle Input Change
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        if (!form.email || !form.password) {
            return setError("All fields are required");
        }

        try {
            setLoading(true);
            const res = await API.post("/auth/login", form);
            // console.log("LOGIN RESPONSE =>", res.data);

            // Save User in Context
            setUser(res.data.user);
            // Save User
            localStorage.setItem(
                "user",
                JSON.stringify(res.data.user)
            );

            // SAVE TOKEN IMPORTANT
            localStorage.setItem(
                "token",
                res.data.token
            );

            // Redirect
            if (res.data.status === "success") {
                setSuccess("Login successful!");
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            } else {
                navigate("/login");
            }

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-8">
                <div className="text-center mb-10">
                    <div className="w-24 h-24 bg-[#5F259F] rounded-full mx-auto mb-5 flex items-center justify-center text-white text-4xl font-bold">
                        P
                    </div>

                    <h1 className="text-4xl font-bold mb-2">
                        Welcome Back
                    </h1>

                    <p className="text-gray-500">
                        Login to your PhonePe account
                    </p>
                </div>

                
                <form onSubmit={handleSubmit}>
                    <div className="space-y-5">
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter email"
                            value={form.email}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-2xl outline-none"
                        />

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter password"
                            value={form.password}
                            onChange={handleChange}
                            className="w-full border p-4 rounded-2xl outline-none"
                        />

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#5F259F] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#4d1f82] transition"
                        >
                            {loading ? "Please Wait..." : "Login"}
                        </button>
                    </div>
                </form>
                <p className="text-center mt-6 text-gray-600">
                    Don't have an account?
                    <Link to="/register" className="text-[#5F259F] font-bold ml-2">
                        Register
                    </Link>
                </p>
                <p className="text-center mt-6 text-gray-600">
                     Already have an account?
                    <Link to="/mpin/login" className="text-[#5F259F] font-bold ml-2">
                        Mpin Login
                    </Link>
                </p>

            </div>
        </div>
    )
}

export default Login
