import { useEffect, useState } from 'react'
import {
  Bell,
  Gift,
  Wallet,
  ShieldCheck,
  AlertCircle,
  CheckCircle2,
  RefreshCcw,
  CheckCheck,
} from 'lucide-react'

import { useAuth } from '../shared/context/AuthContext';
import API from "../shared/api/axios";

const Notifications = () => {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchNotifications = async () => {
    try {
      setLoading(true)

      const token = user?.token || localStorage.getItem('token')
      const res = await API.get('/notifications/list',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.status === 'success') {
        setNotifications(res.data.notifications || [])
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Unable to load notifications'
      )
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  const unreadCount = notifications.filter(
    (item) => !item.isRead
  ).length

  const getIcon = (type) => {
    switch (type) {
      case 'reward':
        return (
          <Gift className="w-5 h-5 text-purple-600" />
        )

      case 'wallet':
        return (
          <Wallet className="w-5 h-5 text-green-600" />
        )

      case 'security':
        return (
          <ShieldCheck className="w-5 h-5 text-blue-600" />
        )

      case 'success':
        return (
          <CheckCircle2 className="w-5 h-5 text-green-600" />
        )

      default:
        return (
          <Bell className="w-5 h-5 text-cyan-600" />
        )
    }
  }

  const formatTime = (date) => {
    const now = new Date()
    const created = new Date(date)

    const diff =
      Math.floor(
        (now - created) / 1000
      )

    if (diff < 60)
      return `${diff}s ago`

    if (diff < 3600)
      return `${Math.floor(
        diff / 60
      )}m ago`

    if (diff < 86400)
      return `${Math.floor(
        diff / 3600
      )}h ago`

    return `${Math.floor(
      diff / 86400
    )}d ago`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-50 p-4 md:p-8">

      <div className="max-w-5xl mx-auto">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-cyan-600 to-blue-600 rounded-[30px] p-6 md:p-8 text-white shadow-xl mb-6">

          <div className="flex justify-between items-center">

            <div>

              <h1 className="text-3xl font-bold">
                Notifications
              </h1>

              <p className="text-cyan-100 mt-2">
                Stay updated with latest alerts
              </p>

            </div>

            <div className="text-center">

              <div className="bg-white/20 rounded-2xl px-5 py-3">
                <h3 className="text-3xl font-bold">
                  {unreadCount}
                </h3>

                <p className="text-sm">
                  Unread
                </p>
              </div>

            </div>

          </div>

        </div>

        {/* ACTIONS */}
        <div className="flex flex-wrap gap-3 mb-6">

          <button
            onClick={fetchNotifications}
            className="flex items-center gap-2 bg-white border border-cyan-100 px-4 py-3 rounded-2xl shadow-sm"
          >
            <RefreshCcw className="w-4 h-4" />
            Refresh
          </button>

          <button
            className="flex items-center gap-2 bg-green-600 text-white px-4 py-3 rounded-2xl shadow-sm"
          >
            <CheckCheck className="w-4 h-4" />
            Mark All Read
          </button>

        </div>

        {/* LOADING */}
        {loading && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="bg-white rounded-3xl p-6 shadow animate-pulse h-24"
              />
            ))}
          </div>
        )}

        {/* ERROR */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex gap-3">

            <AlertCircle className="w-5 h-5 text-red-600" />

            <span className="text-red-600">
              {error}
            </span>

          </div>
        )}

        {/* EMPTY */}
        {!loading &&
          notifications.length === 0 && (
            <div className="bg-white rounded-3xl shadow-lg p-12 text-center">

              <Bell className="w-16 h-16 mx-auto text-gray-300 mb-4" />

              <h3 className="text-xl font-semibold text-gray-700">
                No Notifications
              </h3>

              <p className="text-gray-500 mt-2">
                You're all caught up.
              </p>

            </div>
          )}

        {/* LIST */}
        {!loading &&
          notifications.length > 0 && (
            <div className="space-y-4">

              {notifications.map(
                (notification) => (
                  <div
                    key={
                      notification._id
                    }
                    className={`bg-white rounded-3xl p-5 shadow-lg border transition-all hover:shadow-xl ${!notification.isRead
                      ? 'border-cyan-300 bg-cyan-50/30'
                      : 'border-gray-100'
                      }`}
                  >

                    <div className="flex gap-4">

                      <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center">
                        {getIcon(
                          notification.type
                        )}
                      </div>

                      <div className="flex-1">

                        <div className="flex justify-between items-start">

                          <h3 className="font-bold text-gray-800">
                            {
                              notification.title
                            }
                          </h3>

                          <span className="text-xs text-gray-400">
                            {formatTime(
                              notification.createdAt
                            )}
                          </span>

                        </div>

                        <p className="text-gray-600 mt-2 text-sm leading-6">
                          {
                            notification.message
                          }
                        </p>

                        {!notification.isRead && (
                          <span className="inline-block mt-3 text-xs bg-cyan-100 text-cyan-700 px-3 py-1 rounded-full font-medium">
                            New
                          </span>
                        )}

                      </div>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

      </div>

    </div>
  )
}

export default Notifications