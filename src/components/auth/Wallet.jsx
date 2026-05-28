import React, { useState } from "react";
import API from "../../shared/api/axios";
import { useAuth } from "../../shared/context/AuthContext.jsx";
import { useNavigate } from "react-router-dom";

const Wallet = () => {
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user, setUser } = useAuth();
    const navigate = useNavigate
    const [form, setForm] = useState({
        amount: "",
    });

    // Current Balance
    const totalBalance = Number(user?.balance || 0);
    // Input Change
    const handleChange = (e) => {
        const value = e.target.value.replace(/[^0-9.]/g, "");
        setForm({
            ...form,
            [e.target.name]: value,
        });
    };

    // Submit
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        // Convert properly
        const currentBalance = parseFloat(user?.balance || 0);
        const addAmount = parseFloat(form.amount || 0);

        // Validation
        if (isNaN(addAmount) || addAmount <= 0) {
            return setError("Please enter a valid amount");
        }

        try {
            setLoading(true);
            const token = user?.token || localStorage.getItem("token");
            // API Call
            const res = await API.post("/wallet/add-money",
                {
                    amount: addAmount,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const updatedBalance =
                res?.data?.balance !== undefined
                    ? Number(res.data.balance)
                    : currentBalance + addAmount;

            // Update User
            const updatedUser = {
                ...user,
                balance: updatedBalance,
            };

            // // Save State
            setUser(updatedUser);

            // Save LocalStorage
            localStorage.setItem(
                "user",
                JSON.stringify(updatedUser)
            );

            setSuccess("Money added successfully");
            setTimeout(() => {
                navigate("/dashboard");
            }, 1500);
            // Reset Form
            // setForm({
            //     amount: "",
            // });

        } catch (err) {

            setError(
                err?.response?.data?.message ||
                "Failed to add money"
            );

        } finally {

            setLoading(false);

        }
    };

    return (
        <div className="max-w-md mx-auto bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-2xl font-bold mb-4">
                Wallet
            </h2>

            {/* Balance */}
            <div className="bg-purple-100 text-purple-700 p-4 rounded-xl mb-5">

                <p className="text-sm">
                    Current Balance
                </p>

                <h3 className="text-3xl font-bold">
                    ₹ {totalBalance.toFixed(2)}
                </h3>

            </div>

            {/* Error */}
            {error && (
                <div className="bg-red-100 text-red-600 px-4 py-2 rounded-lg mb-4">
                    {error}
                </div>
            )}

            {/* Success */}
            {success && (
                <div className="bg-green-100 text-green-700 px-4 py-2 rounded-lg mb-4">
                    {success}
                </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit}>

                <div className="mb-4">

                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Add Amount
                    </label>

                    <input
                        type="text"
                        name="amount"
                        value={form.amount}
                        onChange={handleChange}
                        placeholder="Enter amount"
                        className="w-full border border-gray-300 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />

                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-xl font-semibold transition-all disabled:opacity-70"
                >
                    {loading
                        ? "Processing..."
                        : "Add Money"}
                </button>

            </form>

        </div>
    );
};

export default Wallet;