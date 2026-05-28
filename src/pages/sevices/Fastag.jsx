import { useState } from 'react'
import {
  Car,
  ShieldCheck,
  Eye,
  EyeOff,
  CreditCard,
  CheckCircle2,
  Clock3,
  Search,
  Wallet,
  AlertCircle
} from 'lucide-react'

const Fastag = () => {

  const [showBalance, setShowBalance] = useState(true)
  const [loading, setLoading] = useState(false)

  const [form, setForm] = useState({
    vehicleNumber: '',
    bank: '',
    amount: '',
    mpin: ''
  })

  const banks = {
    paytm: 'Paytm FASTag',
    icici: 'ICICI FASTag',
    hdfc: 'HDFC FASTag',
    airtel: 'Airtel FASTag',
    sbi: 'SBI FASTag'
  }

  const handleChange = (e) => {

    const { name, value } = e.target

    // Vehicle Number
    if (name === 'vehicleNumber') {

      const cleaned = value.toUpperCase()

      setForm((prev) => ({
        ...prev,
        vehicleNumber: cleaned
      }))

      return
    }

    // Amount
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

  const handleReset = () => {

    setForm({
      vehicleNumber: '',
      bank: '',
      amount: '',
      mpin: ''
    })
  }

  const handleSubmit = async (e) => {

    e.preventDefault()

    if (!form.vehicleNumber) {
      return alert('Please enter vehicle number')
    }

    if (!form.bank) {
      return alert('Please select FASTag provider')
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

        alert('FASTag recharge successful')

        handleReset()

      }, 2000)

    } catch (error) {

      setLoading(false)

      alert('Recharge failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Section */}
        <div className="lg:col-span-2 space-y-6">

          {/* Balance Card */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden">

            <div className="absolute top-0 right-0 w-56 h-56 bg-white/10 rounded-full blur-3xl"></div>

            <div className="relative z-10">

              <div className="flex items-center justify-between mb-8">

                <div>

                  <p className="text-sm opacity-80 mb-2">
                    Available Main Balance
                  </p>

                  <h1 className="text-4xl font-bold tracking-wide">
                    {showBalance ? '₹25,480.00' : '₹ ••••••'}
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
                    Today's Recharge
                  </p>

                  <h3 className="font-bold text-lg">
                    ₹2,500
                  </h3>

                </div>

                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">

                  <p className="text-sm opacity-80 mb-1">
                    Monthly Recharge
                  </p>

                  <h3 className="font-bold text-lg">
                    ₹18,400
                  </h3>

                </div>

                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">

                  <p className="text-sm opacity-80 mb-1">
                    Cashback
                  </p>

                  <h3 className="font-bold text-lg">
                    ₹860
                  </h3>

                </div>

                <div className="bg-white/10 rounded-2xl p-4 backdrop-blur-sm">

                  <p className="text-sm opacity-80 mb-1">
                    Rewards
                  </p>

                  <h3 className="font-bold text-lg">
                    ₹540
                  </h3>

                </div>

              </div>

            </div>

          </div>

          {/* FASTag Recharge Form */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center gap-4 mb-6">

              <div className="bg-orange-100 text-orange-600 p-4 rounded-2xl">
                <Car />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  FASTag Recharge
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Recharge your FASTag instantly & securely
                </p>

              </div>

            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* FASTag Provider */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  FASTag Provider
                </label>

                <select
                  name="bank"
                  value={form.bank}
                  onChange={handleChange}
                  className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">
                    Select FASTag Provider
                  </option>

                  {
                    Object.entries(banks).map(([key, value]) => (
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

              {/* Vehicle Number */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Vehicle Number
                </label>

                <div className="relative">

                  <input
                    type="text"
                    name="vehicleNumber"
                    value={form.vehicleNumber}
                    onChange={handleChange}
                    placeholder="Enter Vehicle Number"
                    className="w-full border rounded-2xl p-4 pl-12 uppercase outline-none focus:ring-2 focus:ring-orange-500"
                  />

                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>

              </div>

              {/* Recharge Amount */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recharge Amount
                </label>

                <input
                  type="text"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  placeholder="Enter Recharge Amount"
                  className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-orange-500"
                />

              </div>

              {/* Popular Amounts */}
              <div>

                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Popular Recharge
                </label>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">

                  {
                    [200, 500, 1000, 2000].map((amount) => (

                      <button
                        key={amount}
                        type="button"
                        onClick={() => setForm((prev) => ({
                          ...prev,
                          amount: amount.toString()
                        }))}
                        className="border hover:border-orange-500 hover:bg-orange-50 rounded-2xl p-4 transition-all"
                      >

                        <h3 className="font-bold text-gray-800">
                          ₹{amount}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          Quick Recharge
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
                    className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-orange-500"
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
                  className="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 w-full"
                >
                  {
                    loading
                      ? 'Processing...'
                      : 'Recharge FASTag'
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

          {/* FASTag Info */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-orange-100 text-orange-600 p-3 rounded-2xl">
                <CreditCard />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                FASTag Benefits
              </h2>

            </div>

            <div className="space-y-4">

              <div className="border rounded-2xl p-4 bg-orange-50 border-orange-200">

                <h3 className="font-semibold text-orange-600">
                  Instant Toll Payment
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Automatic toll deduction at highways
                </p>

              </div>

              <div className="border rounded-2xl p-4 bg-green-50 border-green-200">

                <h3 className="font-semibold text-green-600">
                  Save Time
                </h3>

                <p className="text-sm text-gray-600 mt-1">
                  Avoid long toll plaza waiting lines
                </p>

              </div>

            </div>

          </div>

          {/* Recent Recharge */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold text-gray-800">
                Recent Recharge
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
                      DL01AB1234
                    </h3>

                    <p className="text-xs text-gray-500">
                      Today • 09:45 AM
                    </p>

                  </div>

                </div>

                <span className="text-red-600 font-semibold">
                  - ₹500
                </span>

              </div>

              <div className="flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                    <CheckCircle2 size={18} />
                  </div>

                  <div>

                    <h3 className="font-medium text-gray-800">
                      HR26DK9090
                    </h3>

                    <p className="text-xs text-gray-500">
                      Yesterday • 06:20 PM
                    </p>

                  </div>

                </div>

                <span className="text-red-600 font-semibold">
                  - ₹1000
                </span>

              </div>

            </div>

          </div>

          {/* Security Tips */}
          <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-3xl shadow-xl p-6">

            <h2 className="text-xl font-bold mb-5">
              Security Tips
            </h2>

            <ul className="space-y-4 text-sm leading-relaxed">

              <li>• Never share your MPIN with anyone</li>
              <li>• Verify vehicle number before recharge</li>
              <li>• Use trusted FASTag providers only</li>
              <li>• Keep sufficient balance for toll payments</li>
              <li>• Contact support for failed recharge</li>

            </ul>

          </div>

          {/* FASTag Wallet */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
                <Wallet />
              </div>

              <h2 className="text-xl font-bold text-gray-800">
                FASTag Wallet
              </h2>

            </div>

            <div className="space-y-4">

              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  Wallet Balance
                </span>

                <span className="font-semibold text-green-600">
                  ₹4,850
                </span>

              </div>

              <div className="flex justify-between border-b pb-3">

                <span className="text-gray-500">
                  Active Tags
                </span>

                <span className="font-semibold">
                  2
                </span>

              </div>

              <div className="flex justify-between">

                <span className="text-gray-500">
                  Low Balance Alert
                </span>

                <span className="text-orange-500 flex items-center gap-1">
                  <AlertCircle size={16} />
                  Enabled
                </span>

              </div>

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default Fastag