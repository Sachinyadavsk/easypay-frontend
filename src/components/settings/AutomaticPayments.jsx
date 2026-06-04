import React, { useEffect, useState } from 'react'
import {
  Repeat,
  Calendar,
  PauseCircle,
  PlayCircle,
  Trash2,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Wallet,
  Clock,
} from 'lucide-react'

import API from '../../shared/api/axios'
import { useAuth } from '../../shared/context/AuthContext'

const AutomaticPayments = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [autoPays, setAutoPays] = useState([])

  const features = [
    {
      title: 'Manage UPI AutoPay',
      description:
        'View, Pause, Resume & Cancel Automatic Payments',
      icon: Repeat,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
  ]

  const fetchAutoPays = async () => {
    try {
      setLoading(true)

      const token =
        user?.token ||
        localStorage.getItem('token')

      const res = await API.get(
        '/autopay/list',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.status === 'success') {
        setAutoPays(
          res.data.autopay || []
        )
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
        'Failed to load AutoPay data'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAutoPays()
  }, [])

  const handlePause = async (id) => {
    try {
      const token =
        user?.token ||
        localStorage.getItem('token')

      const res = await API.put(
        `/autopay/pause/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setSuccess(
        res.data.message ||
        'AutoPay paused successfully'
      )

      fetchAutoPays()
    } catch (error) {
      setError(
        error?.response?.data?.message ||
        'Failed to pause AutoPay'
      )
    }
  }

  const handleResume = async (id) => {
    try {
      const token =
        user?.token ||
        localStorage.getItem('token')

      const res = await API.put(
        `/autopay/resume/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setSuccess(
        res.data.message ||
        'AutoPay resumed successfully'
      )

      fetchAutoPays()
    } catch (error) {
      setError(
        error?.response?.data?.message ||
        'Failed to resume AutoPay'
      )
    }
  }

  const handleDelete = async (id) => {
    try {
      const token =
        user?.token ||
        localStorage.getItem('token')

      const res = await API.delete(
        `/autopay/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      setSuccess(
        res.data.message ||
        'AutoPay removed successfully'
      )

      fetchAutoPays()
    } catch (error) {
      setError(
        error?.response?.data?.message ||
        'Failed to remove AutoPay'
      )
    }
  }

  const activeAutoPay = autoPays.filter(
    (item) => item.status === 'Active'
  )

  const monthlyAmount = activeAutoPay.reduce(
    (total, item) =>
      total + Number(item.amount || 0),
    0
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className=" text-black/90">

        <div className="max-w-6xl mx-auto px-4 py-8">

          <h1 className="text-3xl font-bold">
            Automatic Payments
          </h1>

          <p className="mt-2 text-gray-500">
            Manage your UPI AutoPay mandates
          </p>

        </div>

      </div>

      <div className="max-w-6xl mx-auto p-4 space-y-6">

        {/* Feature */}
        {features.map((feature, index) => {
          const Icon = feature.icon

          return (
            <div
              key={index}
              className="bg-white rounded-3xl p-6 shadow-sm border"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.bg}`}
              >
                <Icon
                  size={30}
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

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Active AutoPay
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {activeAutoPay.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Monthly Payments
            </p>

            <h2 className="text-2xl font-bold mt-2">
              ₹{monthlyAmount}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Upcoming Payments
            </p>

            <h2 className="text-2xl font-bold mt-2">
              {autoPays.length}
            </h2>
          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm">
            <p className="text-sm text-gray-500">
              Status
            </p>

            <h2 className="text-green-600 font-bold mt-2">
              Active
            </h2>
          </div>

        </div>

        {/* Success */}
        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex gap-3">

            <CheckCircle2 className="text-green-600" />

            <span className="text-green-700">
              {success}
            </span>

          </div>
        )}

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

        {/* AutoPay List */}
        {!loading && (
          <div className="space-y-4">

            {autoPays.length > 0 ? (
              autoPays.map((item) => (
                <div
                  key={item._id}
                  className="bg-white rounded-3xl p-5 shadow-sm border"
                >
                  <div className="flex justify-between items-start">

                    <div>

                      <h3 className="font-bold text-lg">
                        {item.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {item.category}
                      </p>

                    </div>

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Active'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                        }`}
                    >
                      {item.status}
                    </span>

                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5">

                    <div>
                      <p className="text-xs text-gray-500">
                        Amount
                      </p>

                      <p className="font-bold">
                        ₹{item.amount}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Frequency
                      </p>

                      <p className="font-semibold">
                        {item.frequency}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Next Date
                      </p>

                      <p className="font-semibold">
                        {item.nextDate}
                      </p>
                    </div>

                    <div>
                      <p className="text-xs text-gray-500">
                        Payment Type
                      </p>

                      <p className="font-semibold">
                        {item.paymentType}
                      </p>
                    </div>

                  </div>

                  <div className="flex flex-wrap gap-3 mt-5">

                    {item.status ===
                      'Active' ? (
                      <button
                        onClick={() =>
                          handlePause(
                            item._id
                          )
                        }
                        className="bg-yellow-50 text-yellow-600 px-4 py-2 rounded-xl flex items-center gap-2"
                      >
                        <PauseCircle size={18} />
                        Pause
                      </button>
                    ) : (
                      <button
                        onClick={() =>
                          handleResume(
                            item._id
                          )
                        }
                        className="bg-green-50 text-green-600 px-4 py-2 rounded-xl flex items-center gap-2"
                      >
                        <PlayCircle size={18} />
                        Resume
                      </button>
                    )}

                    <button
                      onClick={() =>
                        handleDelete(
                          item._id
                        )
                      }
                      className="bg-red-50 text-red-600 px-4 py-2 rounded-xl flex items-center gap-2"
                    >
                      <Trash2 size={18} />
                      Cancel
                    </button>

                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white rounded-3xl p-10 text-center">

                <Repeat
                  size={60}
                  className="mx-auto text-gray-300"
                />

                <h3 className="font-semibold mt-4">
                  No AutoPay Found
                </h3>

                <p className="text-sm text-gray-500 mt-2">
                  You don't have any active
                  AutoPay mandates.
                </p>

              </div>
            )}

          </div>
        )}

        {/* Security */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-3xl p-6 text-white">

          <div className="flex items-center gap-3 mb-4">

            <ShieldCheck />

            <h2 className="text-xl font-bold">
              AutoPay Security
            </h2>

          </div>

          <ul className="space-y-2 text-sm">

            <li>✔ RBI Approved UPI Mandates</li>
            <li>✔ Pause Anytime</li>
            <li>✔ Cancel Anytime</li>
            <li>✔ Secure Bank Authorization</li>
            <li>✔ No Hidden Charges</li>

          </ul>

        </div>

        {/* Benefits */}
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-6 text-white">

          <h2 className="text-xl font-bold mb-4">
            AutoPay Benefits
          </h2>

          <div className="space-y-3">

            <div className="flex items-center gap-3">
              <Calendar size={18} />
              Never miss a bill payment
            </div>

            <div className="flex items-center gap-3">
              <Wallet size={18} />
              Automatic monthly deductions
            </div>

            <div className="flex items-center gap-3">
              <Clock size={18} />
              Save time with recurring payments
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default AutomaticPayments