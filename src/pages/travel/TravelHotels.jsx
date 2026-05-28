import { useEffect, useState } from 'react'
import API from '../../shared/api/axios'
import { useAuth } from '../../shared/context/AuthContext'

import {
  Hotel,
  MapPin,
  CalendarDays,
  Users,
  Search,
  Star,
  Eye,
  EyeOff,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  Wallet,
  Wifi,
  Coffee,
  Car,
  UtensilsCrossed,
  Download,
  IndianRupee,
  BedDouble
} from 'lucide-react'

const TravelHotels = () => {
  const { user, setUser } = useAuth()
  const [showBalance, setShowBalance] = useState(true)
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [hotels, setHotels] = useState([])
  const [ticketData, setTicketData] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [form, setForm] = useState({
    city: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    selectedHotel: '',
    roomType: 'Deluxe',
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
        `/travel/train/recent-bookings/${user_id_value}`,
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

  // HANDLE INPUT
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

  // SEARCH HOTELS
  const handleSearchHotels = async () => {
    setError('')
    setSuccess('')
    if (!form.city) {
      return setError('Please enter city')
    }

    if (!form.checkIn) {
      return setError('Please select check-in date')
    }

    if (!form.checkOut) {
      return setError('Please select check-out date')
    }

    try {
      setSearchLoading(true);
      const token = user?.token || localStorage.getItem('token');
      const response = await API.post('/travel/hotel/search',
        {
          city: form.city,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          guests: form.guests,
          roomType: form.roomType
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (response.data.status) {
        setHotels(response.data.hotels)
      } else {
        setError(
          response.data.message
        )
      }
      setSearchLoading(false)
    } catch (err) {
      setSearchLoading(false)
      setError(
        err?.response?.data?.message ||
        'Hotel search failed'
      )
    }
  }

  // SELECT HOTEL
  const handleHotelSelect = (hotel) => {
    setForm((prev) => ({
      ...prev,
      selectedHotel: hotel.name,
      amount: hotel.price
    }))
  }

  // RESET
  const handleReset = () => {
    setForm({
      city: '',
      checkIn: '',
      checkOut: '',
      guests: 1,
      selectedHotel: '',
      roomType: 'Deluxe',
      amount: '',
      mpin: ''
    })
    setHotels([])
    setTicketData(null)
    setError('')
    setSuccess('')
  }

  // BOOK HOTEL
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.selectedHotel) {
      return setError('Please select hotel')
    }

    if (form.mpin.length !== 4) {
      return setError('Please enter valid MPIN')
    }

    if (Number(form.amount) > Number(totalBalance)) {
      return setError('Insufficient balance')
    }

    try {
      setLoading(true);
      const currentBalance = parseFloat(user?.balance || 0);
      const addAmount = parseFloat(form.amount || 0);
      const token = user?.token || localStorage.getItem('token');
      const response = await API.post('/travel/hotel/book',
        {
          user_id: user?.id,
          city: form.city,
          checkIn: form.checkIn,
          checkOut: form.checkOut,
          guests: form.guests,
          selectedHotel: form.selectedHotel,
          roomType: form.roomType,
          amount: form.amount,
          mpin: form.mpin
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
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
        setTicketData(response.data.booking)
        fetchRecentBookings()
      } else {
        setError(
          response.data.message
        )
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(
        err?.response?.data?.message ||
        'Hotel booking failed'
      )
    }
  }

  // DOWNLOAD PDF
  const downloadTicket = async (bookingId) => {
    try {
      const token = user?.token || localStorage.getItem('token');
      const response = await API.get(`/travel/hotel/download/${bookingId}`,
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
        `hotel-ticket-${bookingId}.pdf`
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
            {/* HEADER */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-rose-100 text-rose-600 p-4 rounded-2xl">
                  <Hotel />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Hotel Booking</h2>
                  <p className="text-sm text-gray-500">Search & book luxury hotels</p>
                </div>
              </div>

              {/* BALANCE */}

              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Wallet className="text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Main Balance</p>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold">
                        {
                          showBalance
                            ? `₹${totalBalance}`
                            : '••••••'
                        }

                      </h3>
                      <button
                        onClick={() =>
                          setShowBalance(
                            !showBalance
                          )
                        }
                      >

                        {
                          showBalance
                            ? <Eye size={18} />
                            : <EyeOff size={18} />
                        }

                      </button>

                    </div>

                  </div>

                </div>

              </div>

            </div>

            {/* SUCCESS */}

            {
              success && (
                <div className="bg-green-100 border border-green-300 text-green-700 rounded-2xl p-4 mb-5">
                  {success}
                </div>
              )
            }

            {/* ERROR */}

            {
              error && (
                <div className="bg-red-100 border border-red-300 text-red-700 rounded-2xl p-4 mb-5">
                  {error}
                </div>
              )
            }

            {/* FORM */}

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* CITY */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Destination City
                </label>

                <div className="relative">

                  <input
                    type="text"
                    name="city"
                    value={form.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-rose-500"
                  />

                  <MapPin
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>

              </div>

              {/* DATES */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Check-In
                  </label>

                  <div className="relative">

                    <input
                      type="date"
                      name="checkIn"
                      value={form.checkIn}
                      onChange={handleChange}
                      className="w-full border rounded-2xl p-4 pl-12"
                    />

                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Check-Out
                  </label>

                  <div className="relative">

                    <input
                      type="date"
                      name="checkOut"
                      value={form.checkOut}
                      onChange={handleChange}
                      className="w-full border rounded-2xl p-4 pl-12"
                    />

                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                  </div>

                </div>

              </div>

              {/* GUESTS */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Guests
                  </label>

                  <div className="relative">

                    <input
                      type="number"
                      min="1"
                      max="10"
                      name="guests"
                      value={form.guests}
                      onChange={handleChange}
                      className="w-full border rounded-2xl p-4 pl-12"
                    />

                    <Users
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Room Type
                  </label>

                  <select
                    name="roomType"
                    value={form.roomType}
                    onChange={handleChange}
                    className="w-full border rounded-2xl p-4"
                  >
                    <option>Deluxe</option>
                    <option>Executive</option>
                    <option>Suite</option>
                    <option>Premium</option>
                  </select>

                </div>

              </div>

              {/* SEARCH */}

              <button
                type="button"
                onClick={
                  handleSearchHotels
                }
                disabled={searchLoading}
                className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-4 rounded-2xl flex items-center justify-center gap-2 w-full"
              >

                <Search size={18} />

                {
                  searchLoading
                    ? 'Searching Hotels...'
                    : 'Search Hotels'
                }

              </button>

              {/* HOTELS */}

              {
                hotels.length > 0 && (

                  <div className="space-y-4">

                    {
                      hotels.map((hotel) => (

                        <button
                          key={hotel.id}
                          type="button"
                          onClick={() =>
                            handleHotelSelect(
                              hotel
                            )
                          }
                          className={`w-full border rounded-2xl p-5 text-left ${form.selectedHotel ===
                            hotel.name
                            ? 'border-rose-500 bg-rose-50'
                            : ''
                            }`}
                        >

                          <div className="flex justify-between flex-col md:flex-row gap-4">

                            <div>

                              <h3 className="font-bold">
                                {hotel.name}
                              </h3>

                              <p className="text-sm text-gray-500 mt-1">
                                {
                                  hotel.location
                                }
                              </p>

                              <div className="flex flex-wrap gap-2 mt-3">

                                {
                                  hotel.amenities?.map(
                                    (
                                      item,
                                      index
                                    ) => (
                                      <span
                                        key={index}
                                        className="bg-gray-100 text-xs px-3 py-1 rounded-full"
                                      >
                                        {item}
                                      </span>
                                    )
                                  )
                                }

                              </div>

                            </div>

                            <div className="text-right">

                              <div className="flex items-center justify-end gap-1 text-yellow-500">

                                <Star
                                  size={16}
                                  fill="currentColor"
                                />

                                {hotel.rating}

                              </div>

                              <h3 className="font-bold text-rose-600 text-xl mt-2">
                                ₹{hotel.price}
                              </h3>

                              <p className="text-xs text-gray-500">
                                Per Night
                              </p>

                            </div>

                          </div>

                        </button>

                      ))
                    }

                  </div>

                )
              }

              {/* AMOUNT */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Total Amount
                </label>

                <div className="relative">

                  <input
                    type="text"
                    value={form.amount}
                    readOnly
                    className="w-full border bg-gray-100 rounded-2xl p-4 pl-12"
                  />

                  <IndianRupee
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>

              </div>

              {/* MPIN */}

              <div>

                <label className="block text-sm font-medium mb-2">
                  Enter MPIN
                </label>

                <div className="relative">

                  <input
                    type="password"
                    name="mpin"
                    value={form.mpin}
                    onChange={handleChange}
                    maxLength={4}
                    placeholder="Enter 4 digit MPIN"
                    className="w-full border rounded-2xl p-4 pl-12"
                  />

                  <ShieldCheck
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>

              </div>

              {/* BUTTONS */}

              <div className="flex flex-col md:flex-row gap-4">

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-rose-600 hover:bg-rose-700 text-white font-semibold px-6 py-4 rounded-2xl w-full"
                >

                  {
                    loading
                      ? 'Processing...'
                      : 'Book Hotel'
                  }

                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold px-6 py-4 rounded-2xl w-full"
                >
                  Reset
                </button>

              </div>

            </form>

          </div>

        </div>

        {/* RIGHT SIDEBAR */}

        <div className="space-y-6">


          {/* DOWNLOAD TICKET */}

          {
            ticketData && (

              <div className="bg-white rounded-3xl shadow-md p-6">

                <h2 className="text-xl font-bold mb-5">
                  Download Ticket
                </h2>

                <div className="space-y-3 text-sm">

                  <p>
                    <strong>Booking ID:</strong> {ticketData.booking_id}
                  </p>

                  <p>
                    <strong>Hotel:</strong> {ticketData.hotel_name}
                  </p>

                  <p>
                    <strong>Amount:</strong> ₹{ticketData.amount}
                  </p>

                </div>

                <button onClick={() => downloadTicket(ticketData.booking_id)
                }
                  className="bg-rose-600 hover:bg-rose-700 text-white w-full mt-5 px-5 py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download PDF
                </button>
              </div>
            )
          }

          {/* RECENT BOOKINGS */}
          <div className="bg-white rounded-3xl shadow-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Recent Bookings</h2>
              <Clock3 size={18} />
            </div>

            <div className="space-y-4 overflow-y-auto max-h-[340px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {recentBookings.length > 0 &&
                recentBookings.filter((item) => item.travel_type === 'Hotel').length > 0 ? (
                recentBookings
                  .filter(
                    (item) =>
                      item.travel_type ===
                      'Hotel'
                  )
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.hotel_name} ({item.room_type})</h3>
                          <p className="text-xs text-gray-500">{item.check_in} → {item.check_out}</p>
                          <p className="text-xs text-gray-500">Guest No : {item.guests} </p>
                          <p className="text-xs text-green-500 ">City : {item.city} </p>
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

          {/* FEATURES */}
          <div className="bg-white rounded-3xl shadow-md p-6">
            <h2 className="text-xl font-bold mb-5">Features</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <Wifi className="mx-auto text-blue-600 mb-2" />
                Wifi
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <Coffee className="mx-auto text-blue-600 mb-2" />
                Meals
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <BedDouble className="mx-auto text-blue-600 mb-2" />
                Sleeper
              </div>

              <div className="bg-gray-50 rounded-2xl p-4 text-center">
                <Wallet className="mx-auto text-blue-600 mb-2" />
                Cashback
              </div>
            </div>
          </div>

        </div>


      </div>

    </div>
  )
}

export default TravelHotels