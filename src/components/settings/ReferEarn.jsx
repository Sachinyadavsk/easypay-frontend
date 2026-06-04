import React, { useEffect, useState } from 'react'
import {
  Gift,
  Users,
  IndianRupee,
  Copy,
  Share2,
  CheckCircle2,
  Clock3,
} from 'lucide-react'

import API from '../../shared/api/axios'
import { useAuth } from '../../shared/context/AuthContext'

const ReferEarn = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [copied, setCopied] = useState(false)

  const [referralData, setReferralData] = useState({
    referralCode: '',
    referralLink: '',
    totalReferrals: 0,
    totalEarned: 0,
    pendingRewards: 0,
    users: [],
  })

  useEffect(() => {
    fetchReferralData()
  }, [])

  const fetchReferralData = async () => {
    try {
      setLoading(true)

      const token =
        user?.token ||
        localStorage.getItem('token')

      const res = await API.get(
        '/referral/details',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.status === 'success') {
        setReferralData(res.data)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const copyCode = () => {
    navigator.clipboard.writeText(
      referralData.referralCode
    )

    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 2000)
  }

  const shareReferral = () => {
    const text = `Join EasyPay and earn cashback using my referral code ${referralData.referralCode}

${referralData.referralLink}`

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      text
    )}`

    window.open(whatsappUrl, '_blank')
  }

  const progress =
    (referralData.totalEarned / 200) * 100

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}

      <div className=" text-black/90">

        <div className="max-w-7xl mx-auto px-4 py-8">

          <h1 className="text-3xl font-bold">
            Refer & Earn
          </h1>

          <p className="mt-2 text-gray-500">
            Earn Cashback Up To ₹200
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">

        {/* Hero Card */}

        <div className="bg-white rounded-3xl shadow-sm p-6">

          <div className="flex items-center gap-4">

            <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">

              <Gift
                size={32}
                className="text-[#5F259F]"
              />

            </div>

            <div>

              <h2 className="font-bold text-2xl">
                Invite Friends
              </h2>

              <p className="text-gray-500">
                Get ₹20 Cashback Per Referral
              </p>

            </div>

          </div>

          {/* Referral Code */}

          <div className="mt-6 border-2 border-dashed border-purple-300 rounded-2xl p-5 flex items-center justify-between">

            <div>

              <p className="text-sm text-gray-500">
                Referral Code
              </p>

              <h3 className="font-bold text-2xl text-[#5F259F]">
                {referralData.referralCode}
              </h3>

            </div>

            <button
              onClick={copyCode}
              className="bg-purple-100 text-[#5F259F] px-4 py-2 rounded-xl flex items-center gap-2"
            >
              <Copy size={18} />

              {copied
                ? 'Copied'
                : 'Copy'}
            </button>

          </div>

          {/* Share */}

          <button
            onClick={shareReferral}
            className="w-full mt-5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-4 rounded-2xl flex items-center justify-center gap-2"
          >
            <Share2 size={18} />
            Share On WhatsApp
          </button>

        </div>

        {/* Stats */}

        <div className="grid md:grid-cols-3 gap-4">

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <Users
              size={30}
              className="text-blue-600 mb-3"
            />

            <h3 className="text-gray-500 text-sm">
              Total Referrals
            </h3>

            <p className="text-3xl font-bold">
              {referralData.totalReferrals}
            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <IndianRupee
              size={30}
              className="text-green-600 mb-3"
            />

            <h3 className="text-gray-500 text-sm">
              Total Earned
            </h3>

            <p className="text-3xl font-bold text-green-600">
              ₹{referralData.totalEarned}
            </p>

          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm">

            <Clock3
              size={30}
              className="text-orange-600 mb-3"
            />

            <h3 className="text-gray-500 text-sm">
              Pending Reward
            </h3>

            <p className="text-3xl font-bold text-orange-600">
              ₹{referralData.pendingRewards}
            </p>

          </div>

        </div>

        {/* Progress */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <div className="flex justify-between mb-3">

            <h3 className="font-bold">
              Cashback Progress
            </h3>

            <span className="font-semibold text-[#5F259F]">
              ₹{referralData.totalEarned}/₹200
            </span>

          </div>

          <div className="w-full bg-gray-200 rounded-full h-4">

            <div
              className="bg-[#5F259F] h-4 rounded-full"
              style={{
                width: `${Math.min(
                  progress,
                  100
                )}%`,
              }}
            />

          </div>

        </div>

        {/* Referred Users */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <h2 className="font-bold text-xl mb-5">
            Referred Users
          </h2>

          {referralData.users.length > 0 ? (

            <div className="space-y-4">

              {referralData.users.map(
                (user, index) => (
                  <div
                    key={index}
                    className="border rounded-2xl p-4 flex justify-between items-center"
                  >
                    <div>

                      <h3 className="font-semibold">
                        {user.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        Joined:{' '}
                        {new Date(
                          user.joinedAt
                        ).toLocaleDateString()}
                      </p>

                    </div>

                    <div className="text-right">

                      <p className="font-bold text-green-600">
                        ₹{user.reward}
                      </p>

                      <span
                        className={`text-xs px-3 py-1 rounded-full ${user.status ===
                            'Paid'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-orange-100 text-orange-600'
                          }`}
                      >
                        {user.status}
                      </span>

                    </div>
                  </div>
                )
              )}

            </div>

          ) : (

            <div className="text-center py-10">

              <Gift
                size={60}
                className="mx-auto text-gray-300"
              />

              <h3 className="mt-3 font-semibold">
                No Referrals Yet
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Invite friends and start earning cashback.
              </p>

            </div>

          )}

        </div>

        {/* How it Works */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <h2 className="font-bold text-xl mb-5">
            How It Works
          </h2>

          <div className="space-y-4">

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-[#5F259F]">
                1
              </div>
              <p>Share your referral code.</p>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-[#5F259F]">
                2
              </div>
              <p>Your friend registers using your code.</p>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center font-bold text-[#5F259F]">
                3
              </div>
              <p>You receive cashback after successful verification.</p>
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default ReferEarn