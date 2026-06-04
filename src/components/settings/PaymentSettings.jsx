import React, { useEffect, useState } from 'react'
import {
    KeyRound,
    Landmark,
    ShieldCheck,
    CheckCircle2,
    AlertCircle,
    Loader2,
    Plus,
    ChevronRight,
} from 'lucide-react'

import API from '../../shared/api/axios'
import { useAuth } from '../../shared/context/AuthContext'

const PaymentSettings = () => {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [accounts, setAccounts] = useState([])

    const features = [
        {
            title: 'UPI PIN',
            description: 'Change or Reset UPI PIN',
            icon: KeyRound,
            bg: 'bg-cyan-50',
            color: 'text-cyan-600',
        },
        {
            title: 'Bank Accounts',
            description: 'Manage Linked Bank Accounts',
            icon: Landmark,
            bg: 'bg-green-50',
            color: 'text-green-600',
        },
    ]

    const fetchPaymentSettings = async () => {
        try {
            setLoading(true)
            const token =user?.token ||localStorage.getItem('token')
            const res = await API.get('/payment-settings',
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            )
            if (res.data.status === 'success') {
                setAccounts(res.data.accounts || [])}
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    'Failed to load payment settings'
            )
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchPaymentSettings()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50">

            {/* Header */}
            <div className=" text-black/90 bg-white">
                <div className="max-w-6xl mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold">
                        Payment Settings
                    </h1>

                    <p className="text-gray-600 mt-2">
                        Manage UPI PIN & Linked Bank Accounts
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto p-4 space-y-6">

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                    {features.map((feature, index) => {
                        const Icon = feature.icon

                        return (
                            <div
                                key={index}
                                className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition"
                            >
                                <div
                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.bg}`}
                                >
                                    <Icon
                                        size={28}
                                        className={feature.color}
                                    />
                                </div>

                                <h3 className="font-bold text-lg mt-4">
                                    {feature.title}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1">
                                    {feature.description}
                                </p>
                            </div>
                        )
                    })}
                </div>

                {/* Error */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">
                        <AlertCircle className="text-red-600" />
                        <span className="text-red-700">
                            {error}
                        </span>
                    </div>
                )}

                {/* Loading */}
                {loading && (
                    <div className="bg-white rounded-3xl p-10 flex justify-center">
                        <Loader2
                            size={40}
                            className="animate-spin text-[#5F259F]"
                        />
                    </div>
                )}

                {/* UPI PIN Section */}
                <div className="bg-white rounded-3xl shadow-sm border p-6">

                    <div className="flex items-center justify-between mb-4">

                        <div>
                            <h2 className="text-xl font-bold">
                                UPI PIN
                            </h2>

                            <p className="text-sm text-gray-500">
                                Secure your payments with UPI PIN
                            </p>
                        </div>

                        <KeyRound className="text-cyan-600" />
                    </div>

                    <div className="space-y-3">

                        <button className="w-full flex items-center justify-between border rounded-2xl p-4 hover:bg-gray-50">
                            <span>Change UPI PIN</span>
                            <ChevronRight size={18} />
                        </button>

                        <button className="w-full flex items-center justify-between border rounded-2xl p-4 hover:bg-gray-50">
                            <span>Reset UPI PIN</span>
                            <ChevronRight size={18} />
                        </button>

                        <button className="w-full flex items-center justify-between border rounded-2xl p-4 hover:bg-gray-50">
                            <span>Forgot UPI PIN</span>
                            <ChevronRight size={18} />
                        </button>

                    </div>

                </div>

                {/* Bank Accounts */}
                <div className="bg-white rounded-3xl shadow-sm border p-6">

                    <div className="flex justify-between items-center mb-5">

                        <div>
                            <h2 className="text-xl font-bold">
                                Linked Bank Accounts
                            </h2>

                            <p className="text-sm text-gray-500">
                                Manage your bank accounts
                            </p>
                        </div>

                        <button className="bg-[#5F259F] text-white px-4 py-2 rounded-xl flex items-center gap-2">
                            <Plus size={18} />
                            Add Bank
                        </button>

                    </div>

                    {accounts.length > 0 ? (
                        <div className="space-y-4">

                            {accounts.map((account, index) => (
                                <div
                                    key={index}
                                    className="border rounded-2xl p-4"
                                >
                                    <div className="flex justify-between">

                                        <div>

                                            <h3 className="font-semibold">
                                                {account.bankName}
                                            </h3>

                                            <p className="text-sm text-gray-500">
                                                XXXX XXXX{' '}
                                                {account.accountNumber?.slice(-4)}
                                            </p>

                                        </div>

                                        <div className="flex items-center gap-2 text-green-600">
                                            <CheckCircle2 size={18} />
                                            Active
                                        </div>

                                    </div>
                                </div>
                            ))}

                        </div>
                    ) : (
                        <div className="text-center py-10">

                            <Landmark
                                size={60}
                                className="mx-auto text-gray-300"
                            />

                            <h3 className="font-semibold mt-4">
                                No Bank Accounts Linked
                            </h3>

                            <p className="text-sm text-gray-500 mt-2">
                                Add your bank account to start UPI payments
                            </p>

                        </div>
                    )}

                </div>

                {/* Security */}
                <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-6 text-white">

                    <div className="flex items-center gap-3 mb-4">
                        <ShieldCheck />
                        <h2 className="text-xl font-bold">
                            Payment Security
                        </h2>
                    </div>

                    <ul className="space-y-2 text-sm">
                        <li>✔ Secure UPI PIN Authentication</li>
                        <li>✔ End-to-End Encryption</li>
                        <li>✔ Bank Level Security</li>
                        <li>✔ Fraud Protection System</li>
                        <li>✔ Real-Time Verification</li>
                    </ul>

                </div>

            </div>

        </div>
    )
}

export default PaymentSettings