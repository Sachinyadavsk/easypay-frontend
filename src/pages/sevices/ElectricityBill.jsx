import { useEffect, useState } from 'react'
import {
    ShieldCheck,
    Zap,
    User,
    Smartphone,
    Lock,
    CheckCircle2,
    Eye,
    EyeOff,
    AlertCircle
} from 'lucide-react'

import API from '../../shared/api/axios'
import { useAuth } from '../../shared/context/AuthContext'

const ElectricityBill = () => {

    const { user, setUser } = useAuth()
    const [showMpin, setShowMpin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [verified, setVerified] = useState(false)
    const [recentTransfers, setRecentTransfers] = useState([]);

    useEffect(() => {
        const fetchUsersHistory = async () => {
            try {
                setLoading(true);
                const token = user?.token || localStorage.getItem("token");
                const res = await API.get("/transactions/history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.data.status === 'success') {
                    setRecentTransfers(res.data.transactions);
                } else {
                    setError(
                        err?.response?.data?.message ||
                        "Failed to load history"
                    );
                }
            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                    "Failed to load history"
                );

            } finally {
                setLoading(false);
            }
        };
        fetchUsersHistory();
    }, [user]);

    const [form, setForm] = useState({
        consumerNumber: '',
        board: '',
        mobile: '',
        amount: '',
        mpin: ''
    })

    //   | ELECTRICITY BOARDS
    const electricityBoards = [
        'BSES Rajdhani',
        'BSES Yamuna',
        'Tata Power',
        'UPPCL',
        'NBPDCL',
        'South Bihar Power'
    ]

    //  HANDLE CHANGE
    const totalBalance = Number(user?.balance || 0);
    const handleChange = (e) => {
        const { name, value } = e.target
        // CONSUMER NUMBER
        if (name === 'consumerNumber') {
            const cleaned = value.replace(/\D/g, '')
            if (cleaned.length <= 15) {
                setForm((prev) => ({
                    ...prev,
                    consumerNumber: cleaned
                }))
            }
            return
        }

        // MOBILE
        if (name === 'mobile') {
            const cleaned = value.replace(/\D/g, '')

            if (cleaned.length <= 10) {
                setForm((prev) => ({
                    ...prev,
                    mobile: cleaned
                }))
            }
            return
        }

        // Amount Validation
        if (name === 'amount') {
            const cleaned = value.replace(/[^0-9.]/g, '')
            setForm((prev) => ({
                ...prev,
                amount: cleaned
            }))

            return
        }

        // MPIN
        if (name === 'mpin') {
            const cleaned = value.replace(/\D/g, '')
            if (cleaned.length <= 4) {
                setForm((prev) => ({
                    ...prev,
                    mpin: cleaned
                }))
            }
            return
        }
        setForm((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    //    RESET
    const handleReset = () => {
        setForm({
            consumerNumber: '',
            board: '',
            mobile: '',
            amount: '',
            mpin: ''
        })

        setSuccess('')
        setError('')
        setVerified(false)
    }

    //  | SUBMIT
    const handleVerify = async (e) => {
        e.preventDefault()
        setError('')
        setSuccess('')
        setVerified(false)

        // | VALIDATION
        if (!form.consumerNumber) {
            return setError('Consumer number is required')
        }

        if (form.consumerNumber.length < 6) {
            return setError('Enter valid consumer number')
        }

        if (!form.board) {
            return setError('Please select electricity board')
        }

        if (form.mobile.length !== 10) {
            return setError('Enter valid mobile number')
        }

        if (!form.amount || Number(form.amount) <= 0) {
            return alert('Please enter valid amount')
        }

        if (form.mpin.length !== 4) {
            return setError('Enter valid 4 digit MPIN')
        }

        try {
            setLoading(true)
            const currentBalance = parseFloat(user?.balance || 0);
            const addAmount = parseFloat(form.amount || 0);
            const token = user?.token || localStorage.getItem('token')
            //    PAYLOAD
            const payload = {
                billerName: `${form.board} Electricity Bill Payment`,
                consumerNumber: form.consumerNumber,
                board: form.board,
                mobile_no: form.mobile,
                amount: Number(form.amount),
                mpin: form.mpin
            }

            //   API CALL
            const res = await API.post('/wallet/pay-bill',
                payload,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            )

            const updatedBalance =
                res?.data?.balance !== undefined
                    ? Number(res.data.balance)
                    : currentBalance - addAmount;

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

            setSuccess(
                res?.data?.message || 'Bill payment successful'
            );

            // Reset Form
            setForm({
                consumerNumber: '',
                board: '',
                mobile: '',
                amount: '',
                mpin: ''
            });


        } catch (error) {
            setError(error?.response?.data?.message || 'Payment failed')
        } finally {
            setLoading(false)
        }
    }

    return (

        <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-orange-100 p-4 md:p-8">
            <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 md:p-8 border border-yellow-100">
                    {/* HEADER */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center">
                            <Zap className="w-8 h-8 text-yellow-600" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Electricity Bill Payment
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Fast, secure and instant electricity bill payment
                            </p>
                        </div>
                    </div>

                    {/* INFO CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-yellow-50 border border-yellow-100 rounded-2xl p-4">
                            <ShieldCheck className="w-8 h-8 text-green-600 mb-2" />
                            <h3 className="font-semibold text-gray-800">
                                100% Secure
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Encrypted secure payment system
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                            <CheckCircle2 className="w-8 h-8 text-blue-600 mb-2" />
                            <h3 className="font-semibold text-gray-800">
                                Instant Verify
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Real-time bill verification
                            </p>
                        </div>

                        <div className="bg-green-50 border border-green-100 rounded-2xl p-4">
                            <Smartphone className="w-8 h-8 text-green-600 mb-2" />
                            <h3 className="font-semibold text-gray-800">
                                Quick Payment
                            </h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Fast payment using MPIN
                            </p>
                        </div>
                    </div>

                    {/* SUCCESS */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-green-700">
                                    Success
                                </h3>
                                <p className="text-sm text-green-600">
                                    {success}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* ERROR */}
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-5 flex items-start gap-3">
                            <AlertCircle className="w-6 h-6 text-red-600 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-red-700">
                                    Error
                                </h3>
                                <p className="text-sm text-red-600">
                                    {error}
                                </p>
                            </div>
                        </div>
                    )}

                    {/* FORM */}
                    <form onSubmit={handleVerify} className="space-y-5">
                        {/* CONSUMER NUMBER */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Consumer Number
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    name="consumerNumber"
                                    value={form.consumerNumber}
                                    onChange={handleChange}
                                    placeholder="Enter consumer number"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* BOARD */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Electricity Board
                            </label>
                            <select
                                name="board"
                                value={form.board}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                            >
                                <option value="">
                                    Select Electricity Board
                                </option>

                                {electricityBoards.map(
                                    (board, index) => (

                                        <option
                                            key={index}
                                            value={board}
                                        >
                                            {board}
                                        </option>
                                    )
                                )}

                            </select>
                        </div>

                        {/* MOBILE */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Registered Mobile Number
                            </label>

                            <div className="relative">

                                <input
                                    type="text"
                                    name="mobile"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    placeholder="Enter mobile number"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />
                                <Smartphone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* Amount */}
                        <div>

                            <label className="block text-sm font-medium text-gray-700 mb-2"> Amount</label>
                            <input
                                type="text"
                                name="amount"
                                value={form.amount}
                                onChange={handleChange}
                                placeholder="Enter amount"
                                className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-purple-500"
                            />

                        </div>

                        {/* MPIN */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Enter MPIN
                            </label>

                            <div className="relative">

                                <input
                                    type={
                                        showMpin
                                            ? 'text'
                                            : 'password'
                                    }
                                    name="mpin"
                                    value={form.mpin}
                                    onChange={handleChange}
                                    placeholder="Enter 4 digit MPIN"
                                    maxLength={4}
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-yellow-400"
                                />

                                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowMpin(!showMpin)
                                    }
                                    className="absolute right-4 top-4 text-gray-500"
                                >

                                    {showMpin ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}

                                </button>

                            </div>

                        </div>

                        {/* VERIFIED */}
                        {verified && (

                            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />
                                <div>

                                    <h3 className="font-semibold text-green-700">
                                        Payment Verified Successfully
                                    </h3>

                                    <p className="text-sm text-green-600">
                                        Electricity bill payment completed.
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* BUTTONS */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition duration-300 shadow-lg"
                            >

                                {loading
                                    ? 'Processing Payment...'
                                    : 'Verify & Pay Bill'}

                            </button>

                            <button
                                type="button"
                                onClick={handleReset}
                                className="w-full border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold py-4 rounded-2xl transition duration-300"
                            >
                                Reset
                            </button>

                        </div>

                    </form>

                </div>

                {/* RIGHT */}
                <div className="space-y-6">

                    {/* BILL SUMMARY */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-yellow-100">

                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            ⚡ Bill Summary
                        </h2>

                        <div className="space-y-4 overflow-y-auto max-h-[340px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                            {recentTransfers.length > 0 &&
                                recentTransfers.filter((item) => item.type === "BILL_PAY")
                                    .length > 0 ? (
                                recentTransfers
                                    .filter((item) => item.type === "BILL_PAY")
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-xl p-4 shadow-sm bg-white space-y-3"
                                        >
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Provider
                                                </span>

                                                <span className="font-semibold">
                                                    {item?.board || "Not Available"}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Consumer Number
                                                </span>

                                                <span className="font-semibold">
                                                    {item?.consumerNumber || "Not Available"}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                   Contact Number
                                                </span>

                                                <span className="font-semibold">
                                                    {item?.mobile_no || "Not Available"}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Bill Amount
                                                </span>

                                                <span className="font-semibold text-green-600">
                                                    ₹{item?.amount || "0"}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Due Date
                                                </span>

                                                <span className="font-semibold">
                                                    {new Date(item.createdAt || item.date).toLocaleString()}
                                                </span>
                                            </div>

                                            <div className="border-t pt-4 flex justify-between">
                                                <span className="font-semibold">
                                                    Total Payable
                                                </span>

                                                <span className="font-bold text-xl text-yellow-600">
                                                    ₹{item?.amount || "0"}
                                                </span>
                                            </div>
                                        </div>
                                    ))
                            ) : (
                                <div className="text-center p-6 text-gray-500">
                                    No transaction history found
                                </div>
                            )}
                        </div>

                    </div>

                    {/* CASHBACK */}
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-3xl shadow-xl p-6 text-white">

                        <h2 className="text-xl font-bold mb-3">
                            🎉 Cashback Offer
                        </h2>

                        <p className="text-sm opacity-90 leading-6">
                            Get up to ₹50 cashback on electricity bill payments using wallet balance.
                        </p>

                        <button className="mt-4 bg-white text-orange-600 font-semibold px-4 py-2 rounded-xl">
                            View Offers
                        </button>

                    </div>

                    {/* SECURITY */}
                    <div className="bg-white rounded-3xl shadow-xl p-6 border border-yellow-100">

                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            🔐 Security Features
                        </h2>

                        <ul className="space-y-3 text-sm text-gray-600">

                            <li>
                                ✔️ Secure MPIN Authentication
                            </li>

                            <li>
                                ✔️ Real-time Transaction Verification
                            </li>

                            <li>
                                ✔️ Safe & Encrypted Payments
                            </li>

                            <li>
                                ✔️ Instant Payment Confirmation
                            </li>

                        </ul>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default ElectricityBill