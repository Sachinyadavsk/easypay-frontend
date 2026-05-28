import React, { useEffect, useState } from 'react'
import {
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  Wallet,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react'

import API from '../../shared/api/axios'
import { useAuth } from '../../shared/context/AuthContext'

const CheckBalance = () => {
  const { user } = useAuth()
  // STATES
  const [allBanks, setAllBanks] = useState([])
  const [walletMpin, setWalletMpin] = useState('')
  const [bankMpin, setBankMpin] = useState('')
  const [walletVerified, setWalletVerified] = useState(false)
  const [bankVerified, setBankVerified] = useState(false)
  const [showWalletBalance, setShowWalletBalance] = useState(false)
  const [showBankBalance, setShowBankBalance] = useState(false)
  const [selectedBank, setSelectedBank] = useState(null)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // FETCH BANKS
  useEffect(() => {
    const fetchBanks = async () => {
      try {
        const token = user?.token || localStorage.getItem('token')
        const res = await API.get('/bank/my-banks',
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        if (res.data.success) {
          setAllBanks(res.data.banks || [])
        }

      } catch (err) {
        console.log(err)
      }
    }
    fetchBanks()
  }, [user])

  // CLEAR ALERTS
  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  // VERIFY WALLET MPIN
  const verifyWalletMpin = async () => {
    clearMessages()
    if (walletMpin.length !== 4) {
      return setError(
        'Wallet MPIN must be 4 digits'
      )
    }

    try {
      setLoading(true)
      const token = user?.token || localStorage.getItem('token')
      const res = await API.post('/wallet/verify-mpin',
        {
          mpin: walletMpin
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (res.data.success) {
        setWalletVerified(res.data.balance)
        setShowWalletBalance(res.data.balance)
        setSuccess(
          'Wallet verified successfully'
        )
      } else {
        setError(
          res.data.message ||
          'Invalid Wallet MPIN'
        )
      }

    } catch (err) {
      console.log(err)
      setError(
        err?.response?.data?.message ||
        'Wallet verification failed'
      )
    } finally {
      setLoading(false)
    }
  }

  // SELECT BANK
  const handleSelectBank = (e) => {
    const bank = allBanks.find((item) => item._id === e.target.value)
    setSelectedBank(bank)
    // RESET STATES
    setBankVerified(false)
    setShowBankBalance(false)
    setBankMpin('')
    clearMessages()
  }

  // VERIFY BANK MPIN
  const verifyBankMpin = async () => {
    clearMessages()
    if (!selectedBank) {
      return setError(
        'Please select bank account'
      )
    }
    if (bankMpin.length !== 4) {
      return setError(
        'Bank MPIN must be 4 digits'
      )
    }

    try {
      setLoading(true)
      const token = user?.token || localStorage.getItem('token')
      const res = await API.post('/bank/verify-mpin',
        {
          bankId: selectedBank._id,
          mpin: bankMpin
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (res.data.success) {
        setBankVerified(true)
        setShowBankBalance(true)
        setSuccess(
          'Bank verified successfully'
        )
      } else {
        setError(
          res.data.message ||
          'Invalid Bank MPIN'
        )
      }

    } catch (err) {
      console.log(err)
      setError(
        err?.response?.data?.message ||
        'Bank verification failed'
      )

    } finally {
      setLoading(false)
    }
  }


  return (

    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* ALERTS */}
        <div className="lg:col-span-2">
          {
            success && (
              <div className="bg-green-100 border border-green-300 text-green-700 rounded-2xl p-4 flex items-center gap-3 mb-4">
                <CheckCircle2 size={20} />
                {success}
              </div>
            )
          }

          {
            error && (
              <div className="bg-red-100 border border-red-300 text-red-700 rounded-2xl p-4 flex items-center gap-3 mb-4">
                <AlertCircle size={20} />
                {error}
              </div>
            )
          }

        </div>

        {/* WALLET */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="flex justify-between items-center mb-5">
            <div>
              <h2 className="text-2xl font-bold">Wallet Balance</h2>
              <p className="text-sm text-gray-500">Verify wallet MPIN</p>
            </div>
            <button onClick={() => walletVerified && setShowWalletBalance(!showWalletBalance)} className="bg-purple-100 text-purple-700 p-3 rounded-2xl">
              {
                showWalletBalance
                  ? <EyeOff />
                  : <Eye />
              }
            </button>
          </div>

          <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-3xl p-8">
            <div className="flex items-center gap-4">
              <Wallet size={32} />
              <div>
                <p className="text-sm opacity-80">Available Balance</p>
                <h1 className="text-4xl font-bold">
                  {showWalletBalance ? `₹${Number(user?.balance || 0
                  ).toFixed(2)}`
                    : '₹ ••••••'
                  }
                </h1>
              </div>
            </div>
          </div>

          {
            !walletVerified && (
              <div className="mt-6">
                <div className="relative">
                  <input
                    type="password"
                    maxLength={4}
                    value={walletMpin}
                    onChange={(e) =>
                      setWalletMpin(
                        e.target.value.replace(/\D/g, '')
                      )
                    }
                    placeholder="Enter Wallet MPIN"
                    className="w-full border rounded-2xl p-4 pl-12 outline-none"
                  />
                  <ShieldCheck
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
                <button
                  onClick={verifyWalletMpin}
                  disabled={loading}
                  className="bg-purple-700 hover:bg-purple-800 text-white w-full p-4 rounded-2xl mt-4 flex items-center justify-center gap-2"
                >
                  {
                    loading
                      ? <Loader2 className="animate-spin" />
                      : 'Verify Wallet MPIN'
                  }
                </button>
              </div>

            )
          }
        </div>

        {/* BANK */}
        <div className="bg-white rounded-3xl shadow-md p-6">
          <div className="flex items-center gap-3 mb-5">
            <Building2 className="text-green-700" />
            <div>
              <h2 className="text-2xl font-bold">Bank Balance</h2>
              <p className="text-sm text-gray-500">Verify bank MPIN</p>
            </div>
          </div>

          {/* SELECT BANK */}
          <select onChange={handleSelectBank} className="w-full border rounded-2xl p-4 mb-5">
            <option value="">Select Bank Account</option>
            {
              allBanks.map((bank) => (
                <option
                  key={bank._id}
                  value={bank._id}
                >
                  {bank.bank} • {bank.account}
                </option>
              ))
            }
          </select>

          {
            selectedBank && (
              <>
                <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-3xl p-8">
                  <h3 className="text-lg opacity-80">{selectedBank.bank}</h3>
                  <h1 className="text-4xl font-bold mt-2">
                    {
                      showBankBalance
                        ? `₹${Number(
                          selectedBank.balance || 0
                        ).toLocaleString()}`
                        : '₹ ••••••'
                    }
                  </h1>
                  <p className="mt-4">Account: {selectedBank.account}</p>
                </div>

                {
                  !bankVerified && (
                    <div className="mt-6">
                      <div className="relative">
                        <input
                          type="password"
                          maxLength={4}
                          value={bankMpin}
                          onChange={(e) =>
                            setBankMpin(
                              e.target.value.replace(/\D/g, '')
                            )
                          }
                          placeholder="Enter Bank MPIN"
                          className="w-full border rounded-2xl p-4 pl-12 outline-none"
                        />
                        <ShieldCheck
                          className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                      </div>
                      <button
                        onClick={verifyBankMpin}
                        disabled={loading}
                        className="bg-green-600 hover:bg-green-700 text-white w-full p-4 rounded-2xl mt-4 flex items-center justify-center gap-2"
                      >
                        {
                          loading
                            ? <Loader2 className="animate-spin" />
                            : 'Verify Bank MPIN'
                        }
                      </button>
                    </div>
                  )
                }
              </>
            )
          }
        </div>
      </div>
    </div>
  )
}

export default CheckBalance