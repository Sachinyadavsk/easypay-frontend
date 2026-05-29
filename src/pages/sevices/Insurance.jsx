import { useEffect, useMemo, useState } from 'react'
import {
    Shield,
    ShieldCheck,
    Smartphone,
    Wallet,
    CheckCircle2,
    Eye,
    EyeOff,
    Lock,
    User,
    Gift,
    FileText,
    BadgeCheck,
    Database,
    AlertCircle,
} from 'lucide-react'

import API from '../../shared/api/axios'
import { useAuth } from '../../shared/context/AuthContext'

const insuranceProviders = [
    'LIC India',
    'HDFC Life',
    'ICICI Prudential',
    'SBI Life Insurance',
]


const features = [
    {
        title: 'Secure Payment',
        description: 'Bank-grade encrypted transactions',
        icon: ShieldCheck,
        bg: 'bg-emerald-50',
        color: 'text-green-600',
    },
    {
        title: 'Trusted Service',
        description: 'Instant premium confirmation',
        icon: BadgeCheck,
        bg: 'bg-blue-50',
        color: 'text-blue-600',
    },
    {
        title: 'Rewards & Cashback',
        description: 'Earn rewards on every payment',
        icon: Gift,
        bg: 'bg-purple-50',
        color: 'text-purple-600',
    },
]

const Insurance = () => {
    const { user, setUser } = useAuth()
    const [showMpin, setShowMpin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('')
    const [error, setError] = useState('')
    const [recentRecharge, setRecentRecharge] = useState([])

    const [form, setForm] = useState({
        provider: '',
        policyNumber: '',
        holderName: '',
        mobile: '',
        amount: '',
        mpin: '',
    })

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
            const cleaned = value.replace(/\D/g, '')
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

    // PAYMENT
    const handlePayment = async (e) => {
        e.preventDefault()
        setSuccess('')
        setError('')

        // VALIDATION
        if (!form.provider) {
            return setError('Please select insurance provider')
        }

        if (!form.policyNumber) {
            return setError('Policy number is required')
        }

        if (!form.holderName) {
            return setError('Policy holder name is required')
        }

        if (form.mobile.length !== 10) {
            return setError('Enter valid mobile number')
        }

        if (!form.amount || Number(form.amount) <= 0) {
            return setError('Enter valid premium amount')
        }

        if (form.mpin.length !== 4) {
            return setError('Enter valid 4 digit MPIN')
        }

        try {
            setLoading(true)
            const currentBalance = parseFloat(user?.balance || 0)
            const addAmount = parseFloat(form.amount || 0)
            const token = user?.token || localStorage.getItem('token')

            // PAYLOAD
            const payload = {
                provider: form.provider,
                policyNumber: form.policyNumber,
                name: form.holderName,
                mobile_no: form.mobile,
                amount: Number(form.amount),
                mpin: form.mpin
            }

            // API CALL
            const res = await API.post('/wallet/insurance-payment',
                payload,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )

            const updatedBalance = res?.data?.balance !== undefined
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

            setSuccess(res?.data?.message || 'Insurance premium paid successfully')

            // RESET FORM
            setForm({
                provider: '',
                policyNumber: '',
                holderName: '',
                mobile: '',
                amount: '',
                mpin: '',
            })
        } catch (err) {
            setError(err?.response?.data?.message || 'Insurance payment failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 p-4 md:p-8">

            <div className="max-w-7xl mx-auto grid grid-cols-1 xl:grid-cols-3 gap-6">

                {/* LEFT */}
                <div className="xl:col-span-2 space-y-6">

                    {/* HEADER */}
                    <div className="bg-white rounded-[30px] shadow-lg border border-emerald-100 overflow-hidden">

                        <div className="bg-gradient-to-r from-emerald-600 to-green-600 p-6 md:p-8 text-white">

                            <div className="flex items-center gap-4">

                                <div className="w-16 h-16 rounded-2xl bg-white/20 flex items-center justify-center">
                                    <Shield className="w-8 h-8 text-white" />
                                </div>

                                <div>
                                    <h1 className="text-3xl font-bold">
                                        Insurance Premium Payment
                                    </h1>

                                    <p className="text-emerald-100 mt-1">
                                        Secure & instant insurance premium payments
                                    </p>
                                </div>

                            </div>

                        </div>

                        {/* FEATURES */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6">

                            {features.map((feature, index) => {
                                const Icon = feature.icon

                                return (
                                    <div
                                        key={index}
                                        className={`${feature.bg} border border-emerald-100 rounded-2xl p-5 hover:shadow-md transition-all`}
                                    >

                                        <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-4">
                                            <Icon
                                                className={`w-7 h-7 ${feature.color}`}
                                            />
                                        </div>

                                        <h3 className="font-bold text-gray-800">
                                            {feature.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 mt-2 leading-6">
                                            {feature.description}
                                        </p>

                                    </div>
                                )
                            })}

                        </div>

                    </div>

                    {/* SUCCESS */}
                    {success && (
                        <div className="bg-green-50 border border-green-200 rounded-2xl p-5 flex items-start gap-3">

                            <CheckCircle2 className="w-6 h-6 text-green-600 mt-0.5" />

                            <div>
                                <h3 className="font-semibold text-green-700">
                                    Premium Paid Successfully
                                </h3>

                                <p className="text-sm text-green-600 mt-1">
                                    Your insurance premium payment completed successfully.
                                </p>
                            </div>

                        </div>
                    )}

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
                    <div className="bg-white rounded-[30px] shadow-lg border border-emerald-100 p-6 md:p-8">

                        <form
                            onSubmit={handlePayment}
                            className="space-y-6"
                        >

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                                {/* PROVIDER */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Insurance Provider
                                    </label>

                                    <select
                                        name="provider"
                                        value={form.provider}
                                        onChange={handleChange}
                                        className="w-full border border-gray-200 rounded-2xl px-4 py-4 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    >

                                        <option value="">
                                            Select Insurance Company
                                        </option>

                                        {insuranceProviders.map((insuranceprovider, index) => (
                                            <option
                                                key={index}
                                                value={insuranceprovider}
                                            >
                                                {insuranceprovider}
                                            </option>
                                        ))}

                                    </select>
                                </div>

                                {/* POLICY NUMBER */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Policy Number
                                    </label>

                                    <div className="relative">

                                        <input
                                            type="text"
                                            name="policyNumber"
                                            value={form.policyNumber}
                                            onChange={handleChange}
                                            placeholder="Enter policy number"
                                            className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        />

                                        <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                                    </div>
                                </div>

                                {/* HOLDER NAME */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Policy Holder Name
                                    </label>

                                    <div className="relative">

                                        <input
                                            type="text"
                                            name="holderName"
                                            value={form.holderName}
                                            onChange={handleChange}
                                            placeholder="Enter holder name"
                                            className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        />

                                        <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                                    </div>
                                </div>

                                {/* MOBILE */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                                        Mobile Number
                                    </label>

                                    <div className="relative">

                                        <input
                                            type="tel"
                                            name="mobile"
                                            value={form.mobile}
                                            onChange={handleChange}
                                            placeholder="Enter mobile number"
                                            className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                        />

                                        <Smartphone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                                    </div>
                                </div>

                            </div>

                            {/* AMOUNT */}
                            <div>

                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Premium Amount
                                </label>

                                <div className="relative">

                                    <input
                                        type="number"
                                        name="amount"
                                        value={form.amount}
                                        onChange={handleChange}
                                        placeholder="Enter premium amount"
                                        className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                    />

                                    <Wallet className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                                </div>

                            </div>

                            {/* QUICK AMOUNT */}
                            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">

                                {[500, 1000, 2500, 5000, 10000].map((amount) => (
                                    <button
                                        key={amount}
                                        type="button"
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                amount: amount.toString(),
                                            }))
                                        }
                                        className="bg-emerald-50 hover:bg-emerald-600 hover:text-white border border-emerald-100 rounded-2xl py-3 font-semibold text-emerald-700 transition-all"
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
                                        type={showMpin ? 'text' : 'password'}
                                        maxLength={4}
                                        name="mpin"
                                        value={form.mpin}
                                        onChange={handleChange}
                                        placeholder="Enter 4 digit MPIN"
                                        className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 pr-12 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400"
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

                            {/* BUTTON */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-emerald-600 to-green-600 hover:opacity-90 text-white font-bold py-4 rounded-2xl transition duration-300 shadow-lg"
                            >
                                {loading
                                    ? 'Processing Payment...'
                                    : 'Pay Insurance Premium'}
                            </button>

                        </form>

                    </div>

                </div>

                {/* RIGHT */}
                <div className="space-y-6">

                    {/* POLICY SUMMARY */}
                    <div className="bg-white rounded-[30px] shadow-lg border border-emerald-100 p-6">

                        <div className="flex items-center justify-between mb-5">

                            <h2 className="text-xl font-bold text-gray-800">
                                🛡️ Policy Summary
                            </h2>

                        </div>

                        <div className="space-y-4 overflow-y-auto max-h-[340px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">

                            {recentRecharge.length > 0 &&
                                recentRecharge.filter(
                                    (item) =>
                                        item.type === 'Insurance'
                                ).length > 0 ? (

                                recentRecharge
                                    .filter(
                                        (item) =>
                                            item.type ===
                                            'Insurance'
                                    )
                                    .map((item, index) => (
                                        <div key={index} className="border rounded-xl p-4 shadow-sm bg-white space-y-3">
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Provider</span>
                                                <span className="font-semibold">
                                                    {item.name}
                                                </span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Policy Type</span>
                                                <span className="font-semibold">{item.operator}</span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Premium Amount</span>
                                                <span className="font-semibold text-green-600"> ₹{item?.amount || 0}</span>
                                            </div>

                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">Due Date</span>
                                                <span className="font-semibold"> {new Date(
                                                    item.createdAt ||
                                                    item.date
                                                ).toLocaleString()}</span>
                                            </div>

                                            <div className="border-t pt-4 flex justify-between">
                                                <span className="font-semibold">Total Payable</span>
                                                <span className="font-bold text-xl text-emerald-600">
                                                    ₹{item?.amount || 0}
                                                </span>
                                            </div>

                                        </div>
                                    ))
                            ) : (
                                <div className="text-center p-6 text-gray-500">
                                    No bill history found
                                </div>
                            )}
                        </div>
                    </div>

                    {/* OFFER */}
                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-[30px] shadow-xl p-6 text-white">
                        <h2 className="text-xl font-bold mb-3">🎁 Insurance Reward Offer</h2>
                        <p className="text-sm leading-6 opacity-90">Pay insurance premium online and get cashback up to ₹100.</p>
                        <button className="mt-4 bg-white text-emerald-600 font-semibold px-4 py-2 rounded-xl">View Offers</button>
                    </div>

                    {/* SECURITY */}
                    <div className="bg-white rounded-[30px] shadow-lg border border-emerald-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-5">🔐 Security Features</h2>
                        <div className="space-y-4">

                            {[
                                'Secure MPIN Authentication',
                                'Instant Premium Verification',
                                'Safe & Encrypted Transactions',
                                'Instant Payment Confirmation',
                                'Trusted Insurance Gateway',
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-sm text-gray-700 font-medium">
                                        {item}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Insurance