import { useState } from 'react'
import {
  CreditCard,
  ShieldCheck,
  Smartphone,
  Wallet,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Building2,
  Gift,
  BadgeCheck,
  CalendarDays,
} from 'lucide-react'

const LoanEmiPayment = () => {
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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-yellow-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl border border-orange-100 p-6 md:p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 rounded-2xl bg-orange-100 flex items-center justify-center">
              <CreditCard className="w-8 h-8 text-orange-600" />
            </div>

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Loan EMI Payment
              </h1>
              <p className="text-gray-500 mt-1">
                Pay your loan EMI securely with instant confirmation
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-orange-50 border border-orange-100 rounded-2xl p-4">
              <ShieldCheck className="w-8 h-8 text-green-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Secure Payment</h3>
              <p className="text-sm text-gray-500 mt-1">
                Fully encrypted EMI transactions
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4">
              <BadgeCheck className="w-8 h-8 text-blue-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Instant Confirmation</h3>
              <p className="text-sm text-gray-500 mt-1">
                Real-time EMI payment updates
              </p>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-2xl p-4">
              <Gift className="w-8 h-8 text-purple-600 mb-2" />
              <h3 className="font-semibold text-gray-800">Cashback Rewards</h3>
              <p className="text-sm text-gray-500 mt-1">
                Get cashback on EMI payments
              </p>
            </div>
          </div>

          <form onSubmit={handlePayment} className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Bank / Loan Provider
              </label>

              <select className="w-full border border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-orange-400">
                <option>Select Loan Provider</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>SBI Bank</option>
                <option>Bajaj Finance</option>
                <option>Axis Bank</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Loan Account Number
              </label>

              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter loan account number"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                <Building2 className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Registered Mobile Number
              </label>

              <div className="relative">
                <input
                  type="tel"
                  placeholder="Enter mobile number"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                <Smartphone className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                EMI Amount
              </label>

              <div className="relative">
                <input
                  type="number"
                  placeholder="Enter EMI amount"
                  className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 focus:outline-none focus:ring-2 focus:ring-orange-400"
                />

                <Wallet className="absolute left-4 top-4 w-5 h-5 text-gray-400" />
              </div>
            </div>

            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {[1000, 2500, 5000, 10000, 15000].map((amount) => (
                <button
                  key={amount}
                  type="button"
                  className="bg-orange-50 hover:bg-orange-100 border border-orange-100 rounded-xl py-3 font-semibold text-orange-700 transition"
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
                  className="w-full border border-gray-200 rounded-2xl px-4 py-4 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                    EMI Paid Successfully
                  </h3>
                  <p className="text-sm text-green-600">
                    Your EMI payment completed successfully.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-4 rounded-2xl transition duration-300 shadow-lg"
            >
              {loading ? 'Processing EMI Payment...' : 'Pay EMI Now'}
            </button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              💳 EMI Summary
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Bank</span>
                <span className="font-semibold">HDFC Bank</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Loan Type</span>
                <span className="font-semibold">Personal Loan</span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Due Date</span>
                <span className="font-semibold flex items-center gap-1">
                  <CalendarDays className="w-4 h-4" />
                  10 Jun 2026
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-500">EMI Amount</span>
                <span className="font-semibold text-orange-600">₹5,000</span>
              </div>

              <div className="border-t pt-4 flex justify-between">
                <span className="font-semibold">Total Payable</span>
                <span className="font-bold text-xl text-orange-600">
                  ₹5,000
                </span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-600 to-yellow-500 rounded-3xl shadow-xl p-6 text-white">
            <h2 className="text-xl font-bold mb-3">
              🎁 EMI Cashback Offer
            </h2>

            <p className="text-sm leading-6 opacity-90">
              Pay EMI online and get cashback up to ₹150 instantly.
            </p>

            <button className="mt-4 bg-white text-orange-600 font-semibold px-4 py-2 rounded-xl">
              View Offers
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl border border-orange-100 p-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">
              🔐 Security Features
            </h2>

            <ul className="space-y-3 text-sm text-gray-600">
              <li>✔️ Secure MPIN Authentication</li>
              <li>✔️ Instant EMI Verification</li>
              <li>✔️ Safe & Encrypted Payments</li>
              <li>✔️ Real-time Confirmation Alerts</li>
              <li>✔️ Trusted Banking Gateway</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoanEmiPayment
