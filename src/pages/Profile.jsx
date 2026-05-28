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

        </div>

      </div>

    </div>
  );
};

export default Profile;