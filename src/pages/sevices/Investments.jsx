import { useState } from 'react'
import {
  TrendingUp,
  ShieldCheck,
  Eye,
  EyeOff,
  Wallet,
  BarChart3,
  IndianRupee,
  Clock3,
  CheckCircle2,
  PieChart,
  Landmark,
  Search,
  AlertTriangle
} from 'lucide-react'

const Investments = () => {

  const [showBalance, setShowBalance] = useState(true)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    investmentType: '',
    plan: '',
    amount: '',
    mpin: ''
  })

  const investmentOptions = {
    mutualfund: 'Mutual Fund',
    sip: 'SIP Investment',
    fd: 'Fixed Deposit',
    gold: 'Digital Gold',
    stocks: 'Stock Investment'
  }

  const plans = [
    {
      id: 1,
      name: 'Secure Growth Fund',
      returns: '12% Returns',
      risk: 'Low Risk',
      amount: 500
    },
    {
      id: 2,
      name: 'Balanced SIP Plan',
      returns: '15% Returns',
      risk: 'Medium Risk',
      amount: 1000
    },
    {
      id: 3,
      name: 'High Growth Equity',
      returns: '20% Returns',
      risk: 'High Risk',
      amount: 2000
    },
    {
      id: 4,
      name: 'Digital Gold Saver',
      returns: '10% Returns',
      risk: 'Safe',
      amount: 3000
    }
  ]

  const handleChange = (e) => {

    const { name, value } = e.target

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
      investmentType: '',
      plan: '',
      amount: '',
      mpin: ''
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!form.investmentType) {
      return alert('Please select investment type')
    }

    if (!form.plan) {
      return alert('Please select investment plan')
    }

    if (!form.amount || Number(form.amount) <= 0) {
      return alert('Please enter valid amount')
    }

    if (form.mpin.length !== 4) {
      return alert('Please enter valid 4 digit MPIN')
    }

    try {

      setLoading(true)

      // Fake API Request
      setTimeout(() => {

        setLoading(false)

        alert('Investment successful')

        handleReset()

      }, 2000)

    } catch (error) {

      setLoading(false)

      alert('Investment failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">

            <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">

              <div className="flex items-center justify-between mb-8">

                <div>

                  <p className="text-sm opacity-80 mb-2">
                    Total Investment Balance
                  </p>

                  <h1 className="text-4xl font-bold tracking-wide">
                    {
                      showBalance
                        ? '₹1,25,480.00'
                        : '₹ ••••••'
                    }
                  </h1>

                </div>

                <button
                  onClick={() => setShowBalance(!showBalance)}
                  className="bg-white/20 hover:bg-white/30 transition-all p-3 rounded-2xl"
                >
                  {
                    showBalance
                      ? <EyeOff size={22} />
                      : <Eye size={22} />
                  }
                </button>

              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">

                  <p className="text-sm opacity-80 mb-1">
                    Today's Profit
                  </p>

                  <h3 className="font-bold text-lg">
                    ₹3,250
                  </h3>

                </div>

                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">

                  <p className="text-sm opacity-80 mb-1">
                    Monthly Growth
                  </p>

                  <h3 className="font-bold text-lg">
                    +18%
                  </h3>

                </div>

                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">

                  <p className="text-sm opacity-80 mb-1">
                    Active Plans
                  </p>

                  <h3 className="font-bold text-lg">
                    12
                  </h3>

                </div>

                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">

                  <p className="text-sm opacity-80 mb-1">
                    Rewards
                  </p>

                  <h3 className="font-bold text-lg">
                    ₹1,420
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* Investment Form */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center gap-4 mb-6">

              <div className="bg-emerald-100 text-emerald-600 p-4 rounded-2xl">
                <TrendingUp />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Investment Portal
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Secure investment with instant portfolio tracking
                </p>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* Investment Type */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Type
                </label>

                <select
                  name="investmentType"
                  value={form.investmentType}
                  onChange={handleChange}
                  className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500"
                >

                  <option value="">
                    Select Investment Type
                  </option>

                  {
                    Object.entries(investmentOptions).map(([key, value]) => (
                      <option
                        key={key}
                        value={key}
                      >
                        {value}
                      </option>
                    ))
                  }

                </select>

              </div>

              {/* Investment Plan */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Plan
                </label>

                <select
                  name="plan"
                  value={form.plan}
                  onChange={handleChange}
                  className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-emerald-500"
                >

                  <option value="">
                    Select Plan
                  </option>

                  {
                    plans.map((plan) => (
                      <option
                        key={plan.id}
                        value={plan.name}
                      >
                        {plan.name}
                      </option>
                    ))
                  }

                </select>

              </div>

              {/* Investment Amount */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount
                </label>

                <div className="relative">

                  <input
                    type="text"
                    name="amount"
                    value={form.amount}
                    onChange={handleChange}
                    placeholder="Enter investment amount"
                    className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-emerald-500"
                  />

                  <IndianRupee
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>

              </div>

              {/* Popular Plans */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popular Investment Plans
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {
                    plans.map((item) => (

                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setForm((prev) => ({
                          ...prev,
                          plan: item.name,
                          amount: item.amount.toString()
                        }))}
                        className="border hover:border-emerald-500 hover:bg-emerald-50 rounded-2xl p-5 text-left transition-all"
                      >

                        <h3 className="font-bold text-gray-800">
                          {item.name}
                        </h3>

                        <div className="flex items-center justify-between mt-3">

                          <span className="text-emerald-600 text-sm font-medium">
                            {item.returns}
                          </span>

                          <span className="text-gray-500 text-sm">
                            {item.risk}
                          </span>

                        </div>

                        <p className="text-lg font-bold text-gray-800 mt-3">
                          ₹{item.amount}
                        </p>

                      </button>

                    ))
                  }

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
                    value={form.mpin}
                    onChange={handleChange}
                    maxLength="4"
                    placeholder="Enter MPIN"
                    className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-emerald-500"
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
                  className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 w-full"
                >
                  {
                    loading
                      ? 'Processing...'
                      : 'Invest Now'
                  }
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

          {/* Portfolio */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-2xl">
                <PieChart />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                Portfolio Overview
              </h2>

            </div>

            <div className="space-y-4">

              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  Mutual Funds
                </span>

                <span className="font-semibold text-emerald-600">
                  ₹45,000
                </span>

              </div>

              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  SIP Plans
                </span>

                <span className="font-semibold text-blue-600">
                  ₹25,000
                </span>

              </div>

              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  Digital Gold
                </span>

                <span className="font-semibold text-yellow-600">
                  ₹18,000
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Stocks
                </span>

                <span className="font-semibold text-purple-600">
                  ₹37,480
                </span>

              </div>

            </div>

          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold text-gray-800">
                Recent Investments
              </h2>

              <Clock3
                size={18}
                className="text-gray-400"
              />

            </div>

            <div className="space-y-4">

              <div className="flex items-center justify-between border-b pb-4">

                <div className="flex items-center gap-3">

                  <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>

                    <h3 className="font-medium text-gray-800">
                      SIP Investment
                    </h3>

                    <p className="text-xs text-gray-500">
                      Today • 10:45 AM
                    </p>

                  </div>

                </div>

                <span className="text-red-600 font-semibold">
                  - ₹1,000
                </span>

              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>

                    <h3 className="font-medium text-gray-800">
                      Mutual Fund
                    </h3>

                    <p className="text-xs text-gray-500">
                      Yesterday • 06:20 PM
                    </p>

                  </div>

                </div>

                <span className="text-red-600 font-semibold">
                  - ₹2,500
                </span>

              </div>

            </div>

          </div>

          {/* Investment Insights */}
          <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-3xl shadow-xl p-6">

            <h2 className="text-xl font-bold mb-5">
              Investment Tips
            </h2>

            <ul className="space-y-4 text-sm leading-relaxed">

              <li>• Diversify investments for better returns</li>
              <li>• Invest regularly using SIP plans</li>
              <li>• Never share your MPIN</li>
              <li>• Monitor market trends carefully</li>
              <li>• Start with low-risk investments</li>

            </ul>

          </div>

          {/* Market Overview */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-blue-100 text-blue-600 p-3 rounded-2xl">
                <BarChart3 />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                Market Overview
              </h2>

            </div>

            <div className="space-y-4">

              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  NIFTY 50
                </span>

                <span className="text-green-600 font-semibold">
                  +1.25%
                </span>

              </div>

              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  SENSEX
                </span>

                <span className="text-green-600 font-semibold">
                  +0.92%
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Gold Rate
                </span>

                <span className="text-yellow-600 font-semibold">
                  ₹6,850/g
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Investments