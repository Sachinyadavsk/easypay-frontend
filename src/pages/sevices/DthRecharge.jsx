import { useEffect, useState } from 'react'
import {
    Tv,
    ShieldCheck,
    Smartphone,
    Wallet,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    Gift,
    Zap,
    AlertCircle,
} from 'lucide-react'

import API from '../../shared/api/axios'
import { useAuth } from '../../shared/context/AuthContext'

const DthRecharge = () => {
    const { user, setUser } = useAuth()
    const [showMpin, setShowMpin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [recentRecharge, setRecentRecharge] = useState([])

    const [form, setForm] = useState({
        operator: '',
        customerId: '',
        mobile: '',
        amount: '',
        mpin: '',
    })

    // DTH OPERATORS
    const operators = [
        'Tata Play',
        'Airtel Digital TV',
        'Dish TV',
        'Sun Direct',
        'd2h',
    ]

    // FETCH HISTORY
    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true)
                const token = user?.token || localStorage.getItem('token')
                const res = await API.get('/transactions/history',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                )
                if (res.data.status === 'success') {
                    setRecentRecharge(res.data.transactions)
                }
            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                    'Failed to load history'
                )
            } finally {
                setLoading(false)
            }
        }
        fetchHistory()
    }, [user])

    // HANDLE CHANGE
    const totalBalance = Number(user?.balance || 0);
    const handleChange = (e) => {
        const { name, value } = e.target

        // MOBILE
        if (name === 'mobile') {
            const cleaned = value.replace(/\D/g, '')

            if (cleaned.length <= 10) {
                setForm((prev) => ({
                    ...prev,
                    mobile: cleaned,
                }))
            }

            return
        }

        // AMOUNT
        if (name === 'amount') {
            let cleaned = value.replace(/[^\d.]/g, '')

            const parts = cleaned.split('.')

            if (parts.length > 2) {
                cleaned = parts[0] + '.' + parts[1]
            }

            setForm((prev) => ({
                ...prev,
                amount: cleaned,
            }))

            return
        }

        // MPIN
        if (name === 'mpin') {
            const cleaned = value.replace(/\D/g, '')

            if (cleaned.length <= 4) {
                setForm((prev) => ({
                    ...prev,
                    mpin: cleaned,
                }))
            }

            return
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }))
    }

    // RESET
    const handleReset = () => {
        setForm({
            operator: '',
            customerId: '',
            mobile: '',
            amount: '',
            mpin: '',
        })

        setSuccess('')
        setError('')
    }

    // RECHARGE API
    const handleRecharge = async (e) => {
        e.preventDefault()

        setError('')
        setSuccess('')

        // VALIDATION
        if (!form.operator) {
            return setError('Please select operator')
        }

        if (!form.customerId) {
            return setError('Customer ID is required')
        }

        if (form.mobile.length !== 10) {
            return setError('Enter valid mobile number')
        }

        if (!form.amount || Number(form.amount) <= 0) {
            return setError('Enter valid recharge amount')
        }

        if (form.mpin.length !== 4) {
            return setError('Enter valid 4 digit MPIN')
        }

        try {
            setLoading(true)
            const currentBalance = parseFloat(user?.balance || 0)
            const addAmount = parseFloat(form.amount || 0)
            const token = user?.token || localStorage.getItem('token')

            // API PAYLOAD
            const payload = {
                billerName: `${form.operator} DTH Recharge Payment`,
                operator: form.operator,
                consumerNumber: form.customerId,
                mobile_no: form.mobile,
                amount: Number(form.amount),
                mpin: form.mpin,
            }

            // API CALL
            const res = await API.post(
                '/wallet/dth-recharge',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
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
                res?.data?.message ||
                'Recharge successful'
            )

            // RESET FORM
            setForm({
                operator: '',
                customerId: '',
                mobile: '',
                amount: '',
                mpin: '',
            })
        } catch (error) {
            setError(
                error?.response?.data?.message ||
                'Recharge failed'
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* LEFT */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-indigo-100 p-6 md:p-8">

                    {/* HEADER */}
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center">
                            <Tv className="w-8 h-8 text-indigo-600" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                DTH Recharge
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Recharge your DTH instantly with secure payment
                            </p>
                        </div>
                    </div>

                    {/* INFO CARDS */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">

                        <div className="bg-indigo-50 rounded-2xl border border-indigo-100 p-4">
                            <ShieldCheck className="w-8 h-8 text-green-600 mb-2" />

                            <h3 className="font-semibold text-gray-800">
                                Secure Recharge
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Fully encrypted transactions
                            </p>
                        </div>

                        <div className="bg-blue-50 rounded-2xl border border-blue-100 p-4">
                            <Zap className="w-8 h-8 text-blue-600 mb-2" />

                            <h3 className="font-semibold text-gray-800">
                                Instant Activation
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Recharge processed instantly
                            </p>
                        </div>

                        <div className="bg-purple-50 rounded-2xl border border-purple-100 p-4">
                            <Gift className="w-8 h-8 text-purple-600 mb-2" />

                            <h3 className="font-semibold text-gray-800">
                                Cashback Offers
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                                Get exciting cashback rewards
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
                    <form onSubmit={handleRecharge} className="space-y-5">

                        {/* OPERATOR */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Operator
                            </label>

                            <select
                                name="operator"
                                value={form.operator}
                                onChange={handleChange}
                                className="w-full border border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            >
                                <option value="">
                                    Select DTH Operator
                                </option>

                                {operators.map((operator, index) => (
                                    <option
                                        key={index}
                                        value={operator}
                                    >
                                        {operator}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* CUSTOMER ID */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Customer ID / VC Number
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    name="customerId"
                                    value={form.customerId}
                                    onChange={handleChange}
                                    placeholder="Enter customer ID"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />

                                <Tv className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* MOBILE */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mobile Number
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    name="mobile"
                                    value={form.mobile}
                                    onChange={handleChange}
                                    placeholder="Enter mobile number"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />

                                <Smartphone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* AMOUNT */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Recharge Amount
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="Enter recharge amount"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                                />

                                <Wallet className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        {/* QUICK AMOUNT */}
                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {[199, 299, 399, 499, 799].map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    onClick={() =>
                                        setForm((prev) => ({
                                            ...prev,
                                            amount: amount.toString(),
                                        }))
                                    }
                                    className="bg-indigo-50 hover:bg-indigo-100 border border-indigo-100 rounded-xl py-3 font-semibold text-indigo-700 transition"
                                >
                                    ₹{amount}
                                </button>
                            ))}
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
                                    maxLength={4}
                                    placeholder="Enter 4 digit MPIN"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-400"
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

                        {/* BUTTONS */}
                        <div className="flex flex-col md:flex-row gap-4">

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 rounded-2xl transition duration-300 shadow-lg"
                            >
                                {loading
                                    ? 'Processing Recharge...'
                                    : 'Recharge Now'}
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

                    {/* HISTORY */}
                    <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-6">

                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            📺 Recharge History
                        </h2>

                        <div className="space-y-4 overflow-y-auto max-h-[340px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">

                            {recentRecharge.length > 0 &&
                                recentRecharge.filter(
                                    (item) =>
                                        item.type === 'DTH_RECHARGE'
                                ).length > 0 ? (

                                recentRecharge
                                    .filter(
                                        (item) =>
                                            item.type ===
                                            'DTH_RECHARGE'
                                    )
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className="border rounded-xl p-4 shadow-sm bg-white space-y-3"
                                        >

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Operator
                                                </span>

                                                <span className="font-semibold">
                                                    {item?.operator ||
                                                        'N/A'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Customer ID
                                                </span>

                                                <span className="font-semibold">
                                                    {item?.consumerNumber ||
                                                        'N/A'}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Amount
                                                </span>

                                                <span className="font-semibold text-green-600">
                                                    ₹
                                                    {item?.amount ||
                                                        0}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    Date
                                                </span>

                                                <span className="font-semibold">
                                                    {new Date(
                                                        item.createdAt ||
                                                        item.date
                                                    ).toLocaleString()}
                                                </span>
                                            </div>

                                        </div>
                                    ))
                            ) : (
                                <div className="text-center p-6 text-gray-500">
                                    No recharge history found
                                </div>
                            )}

                        </div>
                    </div>

                    {/* OFFER */}
                    <div className="bg-gradient-to-r from-indigo-600 to-blue-600 rounded-3xl shadow-xl p-6 text-white">

                        <h2 className="text-xl font-bold mb-3">
                            🎁 Special Offer
                        </h2>

                        <p className="text-sm leading-6 opacity-90">
                            Recharge above ₹300 and get instant cashback up to ₹50.
                        </p>

                        <button className="mt-4 bg-white text-indigo-600 font-semibold px-4 py-2 rounded-xl">
                            View Offers
                        </button>
                    </div>

                    {/* SECURITY */}
                    <div className="bg-white rounded-3xl shadow-xl border border-indigo-100 p-6">

                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            🔐 Security & Features
                        </h2>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>✔️ Secure MPIN Verification</li>
                            <li>✔️ Instant Recharge Processing</li>
                            <li>✔️ Safe & Encrypted Payment</li>
                            <li>✔️ 24×7 Recharge Service</li>
                            <li>✔️ Cashback & Rewards</li>
                        </ul>

                    </div>

                </div>

            </div>
        </div>
    )
}

export default DthRecharge