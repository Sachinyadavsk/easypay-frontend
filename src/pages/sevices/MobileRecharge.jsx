import { useEffect, useState } from 'react'
import {
    Smartphone,
    ShieldCheck,
    Search,
    Eye,
    EyeOff,
    Clock3,
    CheckCircle2,
    Gift,
    Timer
} from 'lucide-react'
import { useAuth } from '../../shared/context/AuthContext';
import API from '../../shared/api/axios';
import { operators } from '../../static-api/recharageData';
import { rechargePlans } from '../../static-api/recharageData';

const MobileRecharge = () => {

    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [recentTransfers, setRecentTransfers] = useState([]);
    const { user, setUser } = useAuth();

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
        operator: '',
        number: '',
        amount: '',
        mpin: ''
    })

    const totalBalance = Number(user?.balance || 0);
    const handleChange = (e) => {
        const { name, value } = e.target
        // Mobile Number Validation
        if (name === 'number') {
            const cleaned = value.replace(/\D/g, '')
            if (cleaned.length <= 10) {
                setForm((prev) => ({
                    ...prev,
                    number: cleaned
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

        // MPIN Validation
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

    const handleReset = () => {
        setForm({
            operator: '',
            number: '',
            amount: '',
            mpin: ''
        })
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const currentBalance = parseFloat(user?.balance || 0);
        const addAmount = parseFloat(form.amount || 0);
        if (!form.operator) {
            return alert('Please select operator')
        }
        if (form.number.length !== 10) {
            return alert('Please enter valid mobile number')
        }
        if (!form.amount || Number(form.amount) <= 0) {
            return alert('Please enter valid amount')
        }
        if (form.mpin.length !== 4) {
            return alert('Please enter valid MPIN')
        }

        try {
            setLoading(true)
            // Final Payload
            const payload = {
                billerName: `${form.operator} Mobile Recharge`,
                operator: form.operator,
                plans: rechargePlans[form.operator][form.amount],
                mobile_no: form.number,
                amount: Number(form.amount),
                mpin: form.mpin
            };

            // API Request
            const token = user?.token || localStorage.getItem("token");
            const res = await API.post(
                '/wallet/mobile-recharge',
                payload,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

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
                res?.data?.message || 'Recharge successful'
            );

            // Reset Form
            setForm({
                operator: '',
                number: '',
                amount: '',
                mpin: ''
            });
            setTimeout(() => {
                setLoading(false)
                handleReset()
            }, 2000)

        } catch (err) {
            setError(
                err?.response?.data?.message ||
                'Recharge failed'
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-screen bg-gray-100 p-4 md:p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Section */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Mobile Recharge Form */}
                    <div className="bg-white rounded-3xl shadow-md p-6">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="bg-purple-100 text-purple-700 p-4 rounded-2xl">
                                <Smartphone />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-800">Mobile Recharge</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Fast and secure prepaid & postpaid recharge
                                </p>
                            </div>

                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-100 text-red-600 px-4 py-3 rounded-2xl mb-5">
                                {error}
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="bg-green-100 text-green-700 px-4 py-3 rounded-2xl mb-5 flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5" />
                                {success}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Operator */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Select Operator</label>
                                <select
                                    name="operator"
                                    value={form.operator}
                                    onChange={handleChange}
                                    className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-purple-500"
                                >
                                    <option value="">Choose Operator</option>
                                    {Object.entries(operators).map(([key, value]) => (
                                        <option
                                            key={key}
                                            value={key}
                                        >
                                            {value}
                                        </option>
                                    ))}
                                </select>

                            </div>

                            {/* Mobile Number */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        name="number"
                                        value={form.number}
                                        onChange={handleChange}
                                        placeholder="Enter mobile number"
                                        className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-purple-500"
                                    />

                                    <Search
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                </div>
                            </div>

                            {/* Amount */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">Recharge Amount</label>
                                <input
                                    type="text"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="Enter recharge amount"
                                    className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-purple-500"
                                />

                            </div>

                            {/* Popular Plans */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Popular Plans
                                </label>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                                    {[199, 299, 399, 599].map((plan) => (

                                        <button
                                            type="button"
                                            key={plan}
                                            onClick={() => setForm((prev) => ({
                                                ...prev,
                                                amount: plan.toString()
                                            }))}
                                            className="border hover:border-purple-700 hover:bg-purple-50 transition-all rounded-2xl p-4 text-center"
                                        >

                                            <h3 className="font-bold text-gray-800">
                                                ₹{plan}
                                            </h3>

                                            <p className="text-xs text-gray-500 mt-1">
                                                28 Days Plan
                                            </p>

                                        </button>

                                    ))}

                                </div>
                            </div>

                            {/* MPIN */}
                            <div>

                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    4 Digit MPIN
                                </label>

                                <div className="relative">

                                    <input
                                        type="password"
                                        name="mpin"
                                        maxLength="4"
                                        value={form.mpin}
                                        onChange={handleChange}
                                        placeholder="Enter MPIN"
                                        className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-purple-500"
                                    />

                                    <ShieldCheck
                                        size={18}
                                        className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                                    />

                                </div>
                            </div>

                            {/* Buttons */}
                            <div className="flex flex-col md:flex-row gap-4 pt-2">

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="bg-purple-700 hover:bg-purple-800 disabled:opacity-50 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 w-full"
                                >
                                    {loading ? 'Processing...' : 'Recharge Now'}
                                </button>



                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold px-6 py-4 rounded-2xl transition-all duration-300 w-full"
                                >
                                    Reset
                                </button>

                            </div>

                        </form>
                    </div>

                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    {/* Recent Recharge */}
                    <div className="bg-white rounded-3xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xl font-bold text-gray-800">
                                Recent Recharge
                            </h3>

                            <Search className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="space-y-4 overflow-y-auto max-h-[340px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                            {recentTransfers.length > 0 ? (
                                recentTransfers
                                    .filter(
                                        (item) =>
                                            item.type === "Mobile_Recharge"
                                    )
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                                                    {item.operator.charAt(0)}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {item.operator}
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        {item.mobile_no}
                                                    </p>

                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-green-600">
                                                    ₹ {Number(item.amount).toFixed(2)}
                                                </p>

                                                <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-1">
                                                    <Clock3 className="w-3 h-3" />
                                                    {new Date(item.createdAt || item.date).toLocaleString()}
                                                </p>

                                                <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-1">
                                                    <Timer className="w-3 h-3" />
                                                    {item.plans}
                                                </p>

                                            </div>
                                        </div>
                                    ))
                            ) : (

                                <div className="text-center p-6 text-gray-500">No transaction history found</div>
                            )}
                        </div>
                    </div>

                    {/* Security Tips */}
                    <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-3xl shadow-xl p-6">

                        <h2 className="text-xl font-bold mb-5">
                            Security Tips
                        </h2>

                        <ul className="space-y-4 text-sm leading-relaxed">
                            <li>• Never share your MPIN with anyone</li>
                            <li>• Verify operator details before payment</li>
                            <li>• Use secure internet connection</li>
                            <li>• Contact support for failed transactions</li>
                            <li>• Enable app lock for extra security</li>
                        </ul>

                    </div>

                </div>

            </div>

        </div>
    )
}

export default MobileRecharge