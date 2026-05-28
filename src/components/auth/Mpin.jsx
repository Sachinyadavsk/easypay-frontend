import React from 'react';
import { useState } from 'react';
import API from "../../shared/api/axios";
import { useAuth } from "../../shared/context/AuthContext.jsx";
import { useNavigate } from 'react-router-dom';

const Mpin = () => {
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
      const { user } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        mpin: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (form.mpin.length !== 4) {
            return setError("MPIN must be 4 digits");
        }

        try {
            setLoading(true);
            // Call API to verify MPIN
            const token = user?.token || localStorage.getItem("token");
            const res = await API.post("/auth/setup-mpin", form,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            console.log("MPIN VERIFY RESPONSE =>", res.data);
            if (res.data.status === "success") {
                setSuccess(true);
                // Redirect to dashboard after short delay
                setTimeout(() => {
                    navigate("/dashboard");
                }, 1500);
            } else {
                setError("Invalid MPIN");
            }
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "An error occurred while verifying MPIN"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-r from-[#5F259F] to-[#7E3AF2] flex items-center justify-center p-4">
            <div className="bg-white rounded-[40px] shadow-2xl w-full max-w-md p-8 text-center">
                <div className="w-28 h-28 bg-[#5F259F] rounded-full mx-auto mb-8 flex items-center justify-center text-white text-5xl shadow-xl">
                    🔒
                </div>

                <h1 className="text-4xl font-bold mb-4">
                    Enter MPIN
                </h1>

                {/* error and success messages */}
                {error && <p className="text-red-500 mb-4">{error}</p>}
                {success && <p className="text-green-500 mb-4">MPIN Verified Successfully!</p>}

                <p className="text-gray-500 mb-10">
                    Please enter your 4 digit secure MPIN
                </p>
                <form onSubmit={handleSubmit}>
                    <div className="flex justify-center gap-4 mb-10">
                        <input
                            type="password"
                            name="mpin"
                            maxLength="1"
                            value={form.mpin[0] || ""}
                            onChange={(e) => setForm({ mpin: e.target.value + form.mpin.slice(1) })}
                            className="w-16 h-16 border-2 rounded-2xl text-center text-3xl font-bold outline-none"
                        />

                        <input
                            type="password"
                            name="mpin"
                            maxLength="1"
                            value={form.mpin[1] || ""}
                            onChange={(e) => setForm({ mpin: form.mpin[0] + e.target.value + form.mpin.slice(2) })}
                            className="w-16 h-16 border-2 rounded-2xl text-center text-3xl font-bold outline-none"
                        />

                        <input
                            type="password"
                            name="mpin"
                            maxLength="1"
                            value={form.mpin[2] || ""}
                            onChange={(e) => setForm({ mpin: form.mpin.slice(0, 2) + e.target.value + form.mpin.slice(3) })}
                            className="w-16 h-16 border-2 rounded-2xl text-center text-3xl font-bold outline-none"
                        />

                        <input
                            type="password"
                            name="mpin"
                            maxLength="1"
                            value={form.mpin[3] || ""}
                            onChange={(e) => setForm({ mpin: form.mpin.slice(0, 3) + e.target.value })}
                            className="w-16 h-16 border-2 rounded-2xl text-center text-3xl font-bold outline-none"
                        />
                    </div>

                    <button className="w-full bg-[#5F259F] text-white py-4 rounded-2xl font-bold text-lg hover:bg-[#4d1f82] transition">
                        {loading ? "Verifying..." : "Verify MPIN"}
                    </button>
                </form>

                <button className="mt-5 text-[#5F259F] font-bold">
                    Forgot MPIN?
                </button>
            </div>
        </div>
    )
}

export default Mpin
