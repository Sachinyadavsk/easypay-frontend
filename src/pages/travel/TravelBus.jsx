import React, { useEffect, useState } from 'react'
import {
  Bus,
  MapPin,
  Calendar,
  Users,
  Search,
  ShieldCheck,
  Clock3,
  Star,
  CheckCircle2,
  Ticket,
  Wallet,
  Download
} from 'lucide-react'
import { useAuth } from '../../shared/context/AuthContext'
import API from '../../shared/api/axios'

const TravelBus = () => {
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [buses, setBuses] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const { user, setUser } = useAuth()


  const [form, setForm] = useState({
    from: '',
    to: '',
    date: '',
    passengers: 1,
    selectedBus: '',
    amount: '',
    mpin: ''
  })

  const totalBalance = Number(user?.balance || 0);
  const user_id_value = user?._id;

  // RECENT BOOKINGS
  const fetchRecentBookings = async () => {
    try {
      if (!user_id_value) return;

      const token = user?.token || localStorage.getItem('token');

      const res = await API.get(
        `/travel/bus/recent-bookings/${user_id_value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.status) {
        setRecentBookings(res.data.bookings);
        console.log('booking details', res.data.bookings);

      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchRecentBookings();
  }, [user_id_value]);

  // HANDLE CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target
    if (name === 'mpin') {
      const cleaned =
        value.replace(/\D/g, '')
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

  // RESET
  const handleReset = () => {
    setForm({
      from: '',
      to: '',
      date: '',
      passengers: 1,
      selectedBus: '',
      amount: '',
      mpin: ''
    })
    setBuses([])
  }

  // SEARCH BUSES
  const searchBuses = async () => {
    setError('')
    setSuccess('')
    if (!form.from) {
      return setError('Please enter departure city')
    }
    if (!form.to) {
      return setError('Please enter destination city')
    }

    if (!form.date) {
      return setError('Please select journey date')
    }

    try {
      setSearchLoading(true)
      const token = user?.token || localStorage.getItem('token')
      const response = await API.post('/travel/bus/search',
        {
          from: form.from,
          to: form.to,
          date: form.date,
          passengers: form.passengers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.status) {
        setBuses(response.data.buses || [])
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Bus search failed'
      )
    } finally {
      setSearchLoading(false)
    }
  }



  // BOOK BUS
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.selectedBus) {
      return setError('Please select bus')
    }
    if (form.mpin.length !== 4) {
      return setError('Please enter valid MPIN')
    }
    if (Number(form.amount) > Number(totalBalance)) {
      return setError('Insufficient balance')
    }

    try {
      setLoading(true)
      const currentBalance = parseFloat(user?.balance || 0);
      const addAmount = parseFloat(form.amount || 0);
      const token = user?.token || localStorage.getItem('token');

      const response = await API.post('/travel/bus/book',
        {
          from: form.from,
          to: form.to,
          date: form.date,
          passengers: form.passengers,
          selectedBus: form.selectedBus,
          classType:'',
          amount: form.amount,
          mpin: form.mpin
         
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      const updatedBalance =
        response?.data?.balance !== undefined
          ? Number(response.data.balance)
          : currentBalance - addAmount;

      // Update User
      const updatedUser = {
        ...user,
        balance: updatedBalance,
      };

      // // Save State
      setUser(updatedUser);
      // Save LocalStorage
      localStorage.setItem(
        "user",
        JSON.stringify(updatedUser)
      );

      if (response.data.status) {
        setSuccess(response.data.message)
        fetchRecentBookings()
        handleReset()
      } else {
        setError(response.data.message)
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Booking failed'
      )
    } finally {
      setLoading(false)
    }
  }

  // DOWNLOAD TICKET
   const downloadTicket = async (bookingId) => {
    try {
      const token = user?.token || localStorage.getItem('token');
      const response = await API.get(`/travel/bus/download/${bookingId}`,
        {
          responseType: 'blob'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      const url = window.URL.createObjectURL(
        new Blob([response.data])
      )

      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `bus-ticket-${bookingId}.pdf`
      )

      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError(
        'Ticket download failed'
      )
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl shadow-md p-6">
            <div className="flex items-center gap-4 mb-6">
              <div className="bg-blue-100 text-blue-600 p-4 rounded-2xl">
                <Bus />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Bus Ticket Booking</h2>
                <p className="text-sm text-gray-500">Secure online bus booking</p>
              </div>
            </div>

            {/* ALERTS */}
            {
              error && (
                <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-4">
                  {error}
                </div>
              )
            }

            {
              success && (
                <div className="bg-green-100 text-green-600 p-4 rounded-2xl mb-4">
                  {success}
                </div>
              )
            }

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* FROM */}
              <div>
                <label className="block mb-2 text-sm font-medium">From</label>
                <div className="relative">
                  <input
                    type="text"
                    name="from"
                    value={form.from}
                    onChange={handleChange}
                    placeholder="Departure City"
                    className="w-full border rounded-2xl p-4 pl-12"
                  />
                  <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                </div>
              </div>

              {/* TO */}
              <div>
                <label className="block mb-2 text-sm font-medium">
                  To
                </label>

                <div className="relative">

                  <input
                    type="text"
                    name="to"
                    value={form.to}
                    onChange={handleChange}
                    placeholder="Destination City"
                    className="w-full border rounded-2xl p-4 pl-12"
                  />

                  <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>

              </div>

              {/* DATE & PASSENGERS */}
              <div className="grid md:grid-cols-2 gap-4">

                <div>

                  <label className="block mb-2 text-sm font-medium">
                    Journey Date
                  </label>

                  <div className="relative">

                    <input
                      type="date"
                      name="date"
                      value={form.date}
                      onChange={handleChange}
                      className="w-full border rounded-2xl p-4 pl-12"
                    />

                    <Calendar
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                  </div>

                </div>

                <div>

                  <label className="block mb-2 text-sm font-medium">
                    Passengers
                  </label>

                  <div className="relative">

                    <input
                      type="number"
                      min="1"
                      max="6"
                      name="passengers"
                      value={form.passengers}
                      onChange={handleChange}
                      className="w-full border rounded-2xl p-4 pl-12"
                    />

                    <Users
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                  </div>

                </div>

              </div>

              {/* SEARCH BUTTON */}
              <button
                type="button"
                onClick={searchBuses}
                disabled={searchLoading}
                className="bg-black text-white w-full py-4 rounded-2xl"
              >
                {
                  searchLoading
                    ? 'Searching...'
                    : 'Search Buses'
                }
              </button>

              {/* BUS LIST */}
              <div className="space-y-4">

                {
                  buses.map((bus) => (

                    <button
                      key={bus.id}
                      type="button"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          selectedBus: bus.name,
                          amount: bus.price
                        }))
                      }
                      className={`w-full border rounded-2xl p-5 text-left ${form.selectedBus === bus.name
                        ? 'border-blue-500 bg-blue-50'
                        : ''
                        }`}
                    >

                      <div className="flex justify-between">

                        <div>

                          <h3 className="font-bold">
                            {bus.name}
                          </h3>

                          <div className="text-sm text-gray-500 mt-2">

                            {bus.time} →
                            {' '}
                            {bus.arrival}

                          </div>

                          <div className="text-sm text-gray-500">
                            {bus.seats} seats left
                          </div>

                        </div>

                        <div className="text-right">

                          <div className="flex items-center gap-1 text-yellow-500 justify-end">

                            <Star
                              size={16}
                              fill="currentColor"
                            />

                            {bus.rating}

                          </div>

                          <h2 className="text-blue-600 font-bold text-xl mt-2">
                            ₹{bus.price}
                          </h2>

                        </div>

                      </div>

                    </button>
                  ))
                }

              </div>

              {/* MPIN */}
              <div>

                <label className="block mb-2 text-sm font-medium">
                  MPIN
                </label>

                <div className="relative">

                  <input
                    type="password"
                    name="mpin"
                    value={form.mpin}
                    onChange={handleChange}
                    maxLength="4"
                    placeholder="Enter MPIN"
                    className="w-full border rounded-2xl p-4 pl-12"
                  />

                  <ShieldCheck
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>

              </div>

              {/* BOOK BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 text-white w-full py-4 rounded-2xl"
              >
                {
                  loading
                    ? 'Processing...'
                    : 'Book Ticket'
                }
              </button>

            </form>

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* WALLET */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
                <Wallet />
              </div>

              <h2 className="text-xl font-bold">
                Wallet
              </h2>

            </div>

            <div className="flex justify-between">

              <span>
                Available Balance
              </span>

              <span className="font-bold text-green-600">
                ₹{totalBalance}
              </span>

            </div>

          </div>

          {/* RECENT BOOKINGS */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold">
                Recent Trips
              </h2>

              <Clock3
                size={18}
                className="text-gray-400"
              />

            </div>

            <div className="space-y-4 overflow-y-auto max-h-[340px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {recentBookings.length > 0 &&
                recentBookings.filter((item) => item.travel_type === 'Bus').length > 0 ? (
                recentBookings
                  .filter(
                    (item) =>
                      item.travel_type ===
                      'Bus'
                  )
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.bus_name} ({item.class_type})</h3>
                          <p className="text-xs text-gray-500">{item.from_station} → {item.to_station}</p>
                          <p className="text-xs text-gray-500">Passengers No : {item.passengers} </p>
                          <p className="text-xs text-green-500 ">Journey Date : {item.journey_date} </p>
                          <button onClick={() => downloadTicket(item.booking_id)
                          }
                            className="bg-rose-600 hover:bg-rose-700 text-white w-full mt-2 px-3 py-2 rounded-2xl flex items-center justify-center gap-1"
                          >
                            <Download size={20} />
                            Download PDF
                          </button>
                        </div>
                      </div>
                      <span className="text-red-600 font-semibold"> - ₹{item.amount}</span>
                    </div>
                  ))
              ) : (
                <div className="text-center p-6 text-gray-500">
                  No bookings found
                </div>
              )}
            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default TravelBus