import { useState } from 'react'
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
} from 'lucide-react'

const Insurance = () => {
    const [showMpin, setShowMpin] = useState(false)
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)

    const handlePayment = (e) => {
        e.preventDefault()
        setLoading(true)

        setTimeout(() => {
            setLoading(false)
            setSuccess(true)
        }, 1500)
    }
    return (
        <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-green-100 p-4 md:p-8">
            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-emerald-100 p-6 md:p-8">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center">
                            <Shield className="w-8 h-8 text-emerald-600" />
                        </div>

                        <div>
                            <h1 className="text-3xl font-bold text-gray-800">
                                Insurance Premium Payment
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Pay your insurance premium quickly and securely
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
                            <ShieldCheck className="w-8 h-8 text-green-600 mb-2" />
                            <h3 className="font-semibold text-gray-800">Secure Payment</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Bank-grade encrypted transactions
                            </p>
                        </div>

                        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
                            <BadgeCheck className="w-8 h-8 text-blue-600 mb-2" />
                            <h3 className="font-semibold text-gray-800">Trusted Service</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Instant premium confirmation
                            </p>
                        </div>

                        <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
                            <Gift className="w-8 h-8 text-purple-600 mb-2" />
                            <h3 className="font-semibold text-gray-800">Rewards & Cashback</h3>
                            <p className="text-sm text-gray-500 mt-1">
                                Earn rewards on every payment
                            </p>
                        </div>
                    </div>

                    <form onSubmit={handlePayment} className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Insurance Provider
                            </label>

                            <select className="w-full border border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-emerald-400">
                                <option>Select Insurance Company</option>
                                <option>LIC India</option>
                                <option>HDFC Life</option>
                                <option>ICICI Prudential</option>
                                <option>SBI Life Insurance</option>
                                <option>Max Life Insurance</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Policy Number
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter policy number"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />

                                <FileText className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Policy Holder Name
                            </label>

                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Enter holder name"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />

                                <User className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Mobile Number
                            </label>

                            <div className="relative">
                                <input
                                    type="tel"
                                    placeholder="Enter mobile number"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />

                                <Smartphone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Premium Amount
                            </label>

                            <div className="relative">
                                <input
                                    type="number"
                                    placeholder="Enter premium amount"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />

                                <Wallet className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                            {[500, 1000, 2500, 5000, 10000].map((amount) => (
                                <button
                                    key={amount}
                                    type="button"
                                    className="bg-emerald-50 hover:bg-emerald-100 border border-emerald-100 rounded-xl py-3 font-semibold text-emerald-700 transition"
                                >
                                    ₹{amount}
                                </button>
                            ))}
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Enter MPIN
                            </label>

                            <div className="relative">
                                <input
                                    type={showMpin ? 'text' : 'password'}
                                    maxLength={4}
                                    placeholder="Enter 4 digit MPIN"
                                    className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                                />

                                <Lock className="absolute left-4 top-4 w-5 h-5 text-gray-400" />

                                <button
                                    type="button"
                                    onClick={() => setShowMpin(!showMpin)}
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

                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
                                <CheckCircle2 className="w-6 h-6 text-green-600" />

                                <div>
                                    <h3 className="font-semibold text-green-700">
                                        Premium Paid Successfully
                                    </h3>
                                    <p className="text-sm text-green-600">
                                        Your insurance premium payment completed.
                                    </p>
                                </div>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-4 rounded-2xl transition duration-300 shadow-lg"
                        >
                            {loading ? 'Processing Payment...' : 'Pay Insurance Premium'}
                        </button>
                    </form>
                </div>

                <div className="space-y-6">
                    <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-4">
                            🛡️ Policy Summary
                        </h2>

                        <div className="space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Provider</span>
                                <span className="font-semibold">LIC India</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Policy Type</span>
                                <span className="font-semibold">Life Insurance</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Premium Amount</span>
                                <span className="font-semibold text-green-600">₹5,000</span>
                            </div>

                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500">Due Date</span>
                                <span className="font-semibold">05 Jun 2026</span>
                            </div>

                            <div className="border-t pt-4 flex justify-between">
                                <span className="font-semibold">Total Payable</span>
                                <span className="font-bold text-xl text-emerald-600">
                                    ₹5,000
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-r from-emerald-600 to-green-600 rounded-3xl shadow-xl p-6 text-white">
                        <h2 className="text-xl font-bold mb-3">
                            🎁 Insurance Reward Offer
                        </h2>

                        <p className="text-sm leading-6 opacity-90">
                            Pay insurance premium online and get cashback up to ₹100.
                        </p>

                        <button className="mt-4 bg-white text-emerald-600 font-semibold px-4 py-2 rounded-xl">
                            View Offers
                        </button>
                    </div>

                    <div className="bg-white rounded-3xl shadow-xl border border-emerald-100 p-6">
                        <h2 className="text-lg font-bold text-gray-800 mb-4">
                            🔐 Security Features
                        </h2>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li>✔️ Secure MPIN Authentication</li>
                            <li>✔️ Instant Premium Verification</li>
                            <li>✔️ Safe & Encrypted Transactions</li>
                            <li>✔️ Instant Payment Confirmation</li>
                            <li>✔️ Trusted Insurance Gateway</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Insurance
