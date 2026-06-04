import React, { useEffect, useState } from 'react'
import {
  Wallet,
  Smartphone,
  Plane,
  Grid2X2,
  Receipt,
  CalendarDays,
  ShieldCheck,
  CheckCircle2,
  Loader2,
  AlertCircle,
  Clock,
  TrendingUp,
} from 'lucide-react'

import API from '../../shared/api/axios'
import { useAuth } from '../../shared/context/AuthContext'

const OrdersBookings = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [orders, setOrders] = useState([])

  const features = [
    {
      title: 'Payments',
      description: 'UPI, Wallet & Money Transfer',
      icon: Wallet,
      bg: 'bg-cyan-50',
      color: 'text-cyan-600',
    },
    {
      title: 'Recharge',
      description: 'Mobile, DTH & Fastag',
      icon: Smartphone,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      title: 'Travel',
      description: 'Flight, Train & Bus Booking',
      icon: Plane,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      title: 'Others',
      description: 'Bills, Insurance & More',
      icon: Grid2X2,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
  ]

  const fetchOrders = async () => {
    try {
      setLoading(true)

      const token =
        user?.token ||
        localStorage.getItem('token')

      const res = await API.get(
        '/transactions/history',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.status === 'success') {
        setOrders(
          res.data.transactions || []
        )
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
        'Failed to load orders'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  const successOrders = orders.filter(
    (item) =>
      item.status === 'Success'
  )

  const pendingOrders = orders.filter(
    (item) =>
      item.status === 'Pending'
  )

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className=" text-black/90">

        <div className="max-w-7xl mx-auto px-4 py-8">

          <h1 className="text-3xl font-bold">
            Orders & Bookings
          </h1>

          <p className="text-gray-500 mt-2">
            Payments, Recharge, Travel & Others
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">

        {/* Features */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          {features.map((feature, index) => {
            const Icon = feature.icon

            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${feature.bg}`}
                >
                  <Icon
                    size={28}
                    className={feature.color}
                  />
                </div>

                <h3 className="font-bold mt-4">
                  {feature.title}
                </h3>

                <p className="text-sm text-gray-500 mt-1">
                  {feature.description}
                </p>
              </div>
            )
          })}

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

          <div className="bg-white rounded-3xl p-5 shadow-sm">

            <Receipt className="text-cyan-600 mb-2" />

            <p className="text-sm text-gray-500">
              Total Orders
            </p>

            <h2 className="text-2xl font-bold">
              {orders.length}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm">

            <CheckCircle2 className="text-green-600 mb-2" />

            <p className="text-sm text-gray-500">
              Successful
            </p>

            <h2 className="text-2xl font-bold">
              {successOrders.length}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm">

            <Clock className="text-yellow-600 mb-2" />

            <p className="text-sm text-gray-500">
              Pending
            </p>

            <h2 className="text-2xl font-bold">
              {pendingOrders.length}
            </h2>

          </div>

          <div className="bg-white rounded-3xl p-5 shadow-sm">

            <TrendingUp className="text-purple-600 mb-2" />

            <p className="text-sm text-gray-500">
              Activity
            </p>

            <h2 className="text-green-600 font-bold">
              Active
            </h2>

          </div>

        </div>

        {/* Error */}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3">

            <AlertCircle className="text-red-600" />

            <p className="text-red-600">
              {error}
            </p>

          </div>
        )}

        {/* Loading */}

        {loading && (
          <div className="bg-white rounded-3xl p-10 flex justify-center">

            <Loader2
              className="animate-spin text-[#5F259F]"
              size={40}
            />

          </div>
        )}

        {/* Recent Orders */}

        {!loading && (
          <div className="bg-white rounded-3xl p-6 shadow-sm border">

            <div className="flex items-center gap-2 mb-5">

              <CalendarDays className="text-[#5F259F]" />

              <h2 className="text-xl font-bold">
                Recent Activities
              </h2>

            </div>

            {orders.length > 0 ? (
              <div className="space-y-4">

                {orders.map((item, index) => (
                  <div
                    key={index}
                    className="border rounded-2xl p-4 hover:bg-gray-50 transition"
                  >
                    <div className="flex justify-between items-start">

                      <div>

                        <h3 className="font-semibold">
                          {item.type ||
                            item.billerName ||
                            'Transaction'}
                        </h3>

                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(
                            item.createdAt ||
                            item.date
                          ).toLocaleString()}
                        </p>

                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === 'Success'
                            ? 'bg-green-100 text-green-600'
                            : item.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-600'
                              : 'bg-red-100 text-red-600'
                          }`}
                      >
                        {item.status ||
                          'Success'}
                      </span>

                    </div>

                    <div className="mt-4 flex justify-between">

                      <div>
                        <p className="text-xs text-gray-500">
                          Amount
                        </p>

                        <p className="font-bold text-green-600">
                          ₹
                          {item.amount ||
                            0}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs text-gray-500">
                          Category
                        </p>

                        <p className="font-semibold">
                          {item.type ||
                            'Order'}
                        </p>
                      </div>

                    </div>
                  </div>
                ))}

              </div>
            ) : (
              <div className="text-center py-10">

                <Receipt
                  size={60}
                  className="mx-auto text-gray-300"
                />

                <h3 className="font-semibold mt-4">
                  No Orders Found
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  Your recent transactions will appear here.
                </p>

              </div>
            )}

          </div>
        )}

        {/* Security Section */}

        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 rounded-3xl p-6 text-white">

          <div className="flex items-center gap-3 mb-4">

            <ShieldCheck />

            <h2 className="text-xl font-bold">
              Safe & Secure Orders
            </h2>

          </div>

          <ul className="space-y-2 text-sm">

            <li>
              ✔ Secure Payments & Transactions
            </li>

            <li>
              ✔ Instant Recharge Confirmation
            </li>

            <li>
              ✔ Travel Booking Protection
            </li>

            <li>
              ✔ Real-Time Order Tracking
            </li>

            <li>
              ✔ 24×7 Customer Support
            </li>

          </ul>

        </div>

      </div>

    </div>
  )
}

export default OrdersBookings