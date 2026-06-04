import React, { useEffect, useState } from 'react'
import {
  Shield,
  Fingerprint,
  Bell,
  Moon,
  Globe,
  Lock,
  Save,
  CheckCircle2,
} from 'lucide-react'

import API from '../../shared/api/axios'
import { useAuth } from '../../shared/context/AuthContext'

const Settings = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const [settings, setSettings] = useState({
    biometricLogin: true,
    appLock: false,
    notifications: true,
    darkMode: false,
    autoLogout: true,
    language: 'English',
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const token =
        user?.token ||
        localStorage.getItem('token')

      const res = await API.get(
        '/settings/preferences',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.status === 'success') {
        setSettings(res.data.settings)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleToggle = (field) => {
    setSettings((prev) => ({
      ...prev,
      [field]: !prev[field],
    }))
  }

  const handleLanguageChange = (e) => {
    setSettings((prev) => ({
      ...prev,
      language: e.target.value,
    }))
  }

  const saveSettings = async () => {
    try {
      setLoading(true)

      const token =
        user?.token ||
        localStorage.getItem('token')

      const res = await API.post(
        '/settings/preferences',
        settings,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.status === 'success') {
        setSuccess('Settings updated successfully')

        setTimeout(() => {
          setSuccess('')
        }, 3000)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const settingCards = [
    {
      title: 'Biometric Login',
      description:
        'Login using fingerprint or face recognition',
      icon: Fingerprint,
      key: 'biometricLogin',
      color: 'text-green-600',
      bg: 'bg-green-50',
    },
    {
      title: 'App Lock',
      description:
        'Extra security with app lock protection',
      icon: Lock,
      key: 'appLock',
      color: 'text-red-600',
      bg: 'bg-red-50',
    },
    {
      title: 'Notifications',
      description:
        'Receive transaction and offer alerts',
      icon: Bell,
      key: 'notifications',
      color: 'text-blue-600',
      bg: 'bg-blue-50',
    },
    {
      title: 'Dark Mode',
      description:
        'Switch app appearance to dark theme',
      icon: Moon,
      key: 'darkMode',
      color: 'text-purple-600',
      bg: 'bg-purple-50',
    },
    {
      title: 'Auto Logout',
      description:
        'Automatically logout after inactivity',
      icon: Shield,
      key: 'autoLogout',
      color: 'text-orange-600',
      bg: 'bg-orange-50',
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">

      {/* HEADER */}

      <div className="text-black/90">

        <div className="max-w-7xl mx-auto px-4 py-8">

          <h1 className="text-3xl font-bold">
            Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Security & Preferences
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">

        {/* SUCCESS */}

        {success && (
          <div className="bg-green-50 border border-green-200 rounded-2xl p-4 flex items-center gap-3">
            <CheckCircle2 className="text-green-600" />

            <span className="text-green-700">
              {success}
            </span>
          </div>
        )}

        {/* SECURITY CARDS */}

        <div className="grid md:grid-cols-2 gap-5">

          {settingCards.map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-center">

                  <div className="flex gap-4">

                    <div
                      className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg}`}
                    >
                      <Icon
                        className={item.color}
                        size={28}
                      />
                    </div>

                    <div>
                      <h3 className="font-bold">
                        {item.title}
                      </h3>

                      <p className="text-sm text-gray-500 mt-1">
                        {item.description}
                      </p>
                    </div>

                  </div>

                  {/* Toggle */}

                  <button
                    onClick={() =>
                      handleToggle(item.key)
                    }
                    className={`relative inline-flex h-7 w-14 items-center rounded-full transition ${settings[item.key]
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                      }`}
                  >
                    <span
                      className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${settings[item.key]
                        ? 'translate-x-8'
                        : 'translate-x-1'
                        }`}
                    />
                  </button>

                </div>
              </div>
            )
          })}

        </div>

        {/* LANGUAGE */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <div className="flex items-center gap-4 mb-5">

            <div className="w-14 h-14 rounded-2xl bg-cyan-50 flex items-center justify-center">

              <Globe
                className="text-cyan-600"
                size={28}
              />

            </div>

            <div>

              <h3 className="font-bold text-lg">
                Language Preference
              </h3>

              <p className="text-gray-500 text-sm">
                Choose your preferred language
              </p>

            </div>

          </div>

          <select
            value={settings.language}
            onChange={handleLanguageChange}
            className="w-full border border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-[#5F259F]"
          >
            <option>English</option>
            <option>Hindi</option>
            <option>Punjabi</option>
            <option>Gujarati</option>
            <option>Bengali</option>
            <option>Tamil</option>
            <option>Telugu</option>
          </select>

        </div>

        {/* SAVE BUTTON */}

        <button
          onClick={saveSettings}
          disabled={loading}
          className="w-full bg-[#5F259F] hover:bg-[#4f1d84] text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <Save size={18} />

          {loading
            ? 'Saving Settings...'
            : 'Save Preferences'}
        </button>

      </div>

    </div>
  )
}

export default Settings