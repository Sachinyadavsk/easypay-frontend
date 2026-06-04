import React from 'react';
import { useAuth } from '../shared/context/AuthContext';
import { useState } from 'react';
import API from "../shared/api/axios";
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(null);
  const [showQr, setShowQr] = useState(false);
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState(
    user?.notifications ?? true
  )

  const [language, setLanguage] = useState(
    user?.language || 'English'
  )

  const [privacy, setPrivacy] = useState(
    user?.privacy || 'Public'
  )
  const updateNotifications = async () => {
    try {
      const token =
        user?.token ||
        localStorage.getItem('token')

      const newValue = !notifications

      setNotifications(newValue)

      await API.put(
        '/auth/user/notification-settings',
        {
          notifications: newValue,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const updatedUser = {
        ...user,
        notifications: newValue,
      }

      setUser(updatedUser)

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )
    } catch (error) {
      console.log(error)
    }
  }

  const updateLanguage = async (value) => {
    try {
      setLanguage(value)

      const token =
        user?.token ||
        localStorage.getItem('token')

      await API.put(
        '/auth/user/language',
        {
          language: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const updatedUser = {
        ...user,
        language: value,
      }

      setUser(updatedUser)

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )
    } catch (error) {
      console.log(error)
    }
  }

  const updatePrivacy = async (value) => {
    try {
      setPrivacy(value)

      const token =
        user?.token ||
        localStorage.getItem('token')

      await API.put(
        '/auth/user/privacy',
        {
          privacy: value,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const updatedUser = {
        ...user,
        privacy: value,
      }

      setUser(updatedUser)

      localStorage.setItem(
        'user',
        JSON.stringify(updatedUser)
      )
    } catch (error) {
      console.log(error)
    }
  }

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  });

  // SAFE USER DATA
  // SAFE UPI ID
  const qrValue = user?.upiId && user.upiId.includes('@')
    ? user.upiId
    : 'example@upi';

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  // UPDATE PROFILE
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      setLoading(true);
      const token = user?.token || localStorage.getItem("token");
      const res = await API.put(
        '/auth/user/profile',
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      if (res.data.status === 'success') {
        setSuccess(
          'Profile updated successfully!'
        );

        // UPDATED USER
        const updatedUser = {
          ...user,
          ...res.data.user
        };

        // UPDATE CONTEXT
        setUser(updatedUser);

        // UPDATE STORAGE
        localStorage.setItem(
          "user",
          JSON.stringify(updatedUser)
        );

        // REDIRECT
        setTimeout(() => {
          navigate("/dashboard");
        }, 1500);

      } else {

        setError(
          'Failed to update profile'
        );
      }

    } catch (err) {
      console.log(err);
      setError(
        err.response?.data?.message ||
        'An error occurred while updating profile'
      );

    } finally {
      setLoading(false);
    }
  };

  return (

    <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-4 md:p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-3xl shadow-xl p-8">
          {/* PROFILE HEADER */}
          <div className="text-center">
            {/* AVATAR */}
            <div className="w-32 h-32 bg-[#5F259F] rounded-full mx-auto mb-6 flex items-center justify-center text-white text-5xl font-bold shadow-lg">
              {
                user?.name
                  ? user.name.charAt(0).toUpperCase()
                  : 'S'
              }
            </div>

            {/* NAME */}
            <h1 className="text-4xl font-bold text-gray-800">
              {
                user?.name || 'Sachin Kumar'
              }
            </h1>

            {/* EMAIL */}
            <p className="text-gray-500 mt-2">
              {
                user?.email || 'sachin@gmail.com'
              }

            </p>

            {/* PHONE */}
            {
              user?.phone && (
                <p className="text-gray-500 mt-1">
                  {user.phone}
                </p>

              )
            }

            {/* UPI */}
            {
              user?.upiId && (
                <p className="text-purple-700 font-semibold mt-1">
                  {user.upiId}
                </p>
              )
            }

            {/* QR BUTTON */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() =>
                  setShowQr(!showQr)
                }
                className="bg-[#5F259F] hover:bg-[#4b1d80] text-white px-6 py-3 rounded-2xl font-semibold transition-all"
              >
                {
                  showQr
                    ? 'Hide QR Code'
                    : 'Show QR Code'
                }
              </button>
            </div>

            {/* QR DISPLAY */}
            {
              showQr && (

                <div className="mt-8 flex flex-col items-center">

                  <div className="bg-white p-5 rounded-3xl shadow-xl border">

                    <QRCodeSVG
                      value={qrValue}
                      size={220}
                    />

                  </div>

                </div>

              )
            }

          </div>

          {/* ALERTS */}
          {
            error && (

              <div className="bg-red-100 text-red-600 rounded-2xl px-4 py-3 mt-6 text-center">

                {error}

              </div>

            )
          }

          {
            success && (

              <div className="bg-green-100 text-green-700 rounded-2xl px-4 py-3 mt-6 text-center">

                {success}

              </div>

            )
          }

          {/* FORM */}
          <form
            onSubmit={handleSubmit}
            className="mt-10 space-y-5"
          >

            {/* NAME */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#5F259F]"
              />

            </div>

            {/* EMAIL */}
            <div>

              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-[#5F259F]"
              />

            </div>

            {/* UPDATE BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#5F259F] hover:bg-[#4b1d80] text-white py-4 rounded-2xl font-bold text-lg transition-all disabled:opacity-70"
            >

              {
                loading
                  ? 'Updating...'
                  : 'Update Profile'
              }

            </button>

          </form>

          <div className="mt-10 space-y-5">

            <h2 className="text-2xl font-bold">
              Profile Settings
            </h2>

            {/* Privacy */}

            <div className="bg-white border rounded-3xl p-5 shadow-sm">

              <h3 className="font-bold mb-3">
                Privacy Settings
              </h3>

              <select
                value={privacy}
                onChange={(e) =>
                  updatePrivacy(e.target.value)
                }
                className="w-full border rounded-2xl p-4"
              >
                <option value="Public">
                  Public
                </option>

                <option value="Private">
                  Private
                </option>

                <option value="Friends">
                  Friends Only
                </option>

              </select>

            </div>

            {/* Notifications */}

            <div className="bg-white border rounded-3xl p-5 shadow-sm">

              <div className="flex items-center justify-between">

                <div>

                  <h3 className="font-bold">
                    Notifications
                  </h3>

                  <p className="text-gray-500 text-sm">
                    Cashback, Offers & Alerts
                  </p>

                </div>

                <button
                  onClick={updateNotifications}
                  className={`w-14 h-8 rounded-full relative ${notifications
                      ? 'bg-green-500'
                      : 'bg-gray-300'
                    }`}
                >
                  <span
                    className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${notifications
                        ? 'right-1'
                        : 'left-1'
                      }`}
                  />
                </button>

              </div>

            </div>

            {/* Language */}

            <div className="bg-white border rounded-3xl p-5 shadow-sm">

              <h3 className="font-bold mb-3">
                Language
              </h3>

              <select
                value={language}
                onChange={(e) =>
                  updateLanguage(e.target.value)
                }
                className="w-full border rounded-2xl p-4"
              >
                <option>English</option>
                <option>Hindi</option>
                <option>Bengali</option>
                <option>Gujarati</option>
                <option>Marathi</option>
                <option>Tamil</option>
                <option>Telugu</option>
              </select>

            </div>

            {/* KYC Status */}

            <div className="bg-gradient-to-r from-[#5F259F] to-indigo-600 text-white rounded-3xl p-6">

              <h3 className="text-xl font-bold">
                KYC Status
              </h3>

              <p className="mt-2 opacity-90">
                Status:
                {' '}
                {user?.kycStatus || 'Pending'}
              </p>

              {user?.kycStatus !== 'Verified' && (
                <button className="mt-4 bg-white text-[#5F259F] px-5 py-2 rounded-xl font-semibold">
                  Complete KYC
                </button>
              )}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
};

export default Profile;