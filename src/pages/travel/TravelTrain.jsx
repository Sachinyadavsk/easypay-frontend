import { useEffect, useState } from 'react';
import {
  Train,
  MapPin,
  CalendarDays,
  Users,
  ArrowRightLeft,
  ShieldCheck,
  Clock3,
  CheckCircle2,
  Star,
  Wallet,
  Wifi,
  Coffee,
  BedDouble,
  BadgePercent,
  IndianRupee,
  Download,
  Search,
  Eye,
  EyeOff
} from 'lucide-react';
import API from '../../shared/api/axios';
import { useAuth } from '../../shared/context/AuthContext';

const TravelTrain = () => {
  const { user, setUser } = useAuth()
  const [showBalance, setShowBalance] = useState(true)
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [ticketData, setTicketData] = useState(null)
  const [recentBookings, setRecentBookings] = useState([])
  const [trains, setTrains] = useState([])
  const [form, setForm] = useState({
    from: '',
    to: '',
    journeyDate: '',
    quota: 'General',
    classType: 'SL',
    passengers: 1,
    selectedTrain: '',
    amount: '',
    mpin: ''
  })

  // FETCH USER BALANCE
  const totalBalance = Number(user?.balance || 0);
  const user_id_value = user?._id;

  // FETCH RECENT BOOKINGS
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
    // MPIN ONLY 4 DIGIT
    if (name === 'mpin') {
      const cleaned = value.replace(/\D/g, '')
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


  // SWAP STATION
  const handleSwap = () => {
    setForm((prev) => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }))
  }


  // SEARCH TRAIN
  const handleSearchTrain = async () => {
    setError('')
    setSuccess('')
    if (!form.from) {
      return setError('Please enter source station')
    }
    if (!form.to) {
      return setError('Please enter destination station')
    }
    if (!form.journeyDate) {
      return setError('Please select journey date')
    }

    try {
      setSearchLoading(true)
      const response = await API.post('/travel/train/search',
        {
          from: form.from,
          to: form.to,
          journeyDate: form.journeyDate,
          quota: form.quota,
          classType: form.classType,
          passengers: form.passengers
        }
      )

      if (response.data.status) {
        setTrains(response.data.trains)
      } else {
        setError(response.data.message)
      }
      setSearchLoading(false)
    } catch (err) {
      setSearchLoading(false)
      setError(
        err?.response?.data?.message ||
        'Train search failed'
      )
    }
  }


  // SELECT TRAIN
  const handleTrainSelect = (train) => {
    const totalAmount =
      Number(train.price) *
      Number(form.passengers)

    setForm((prev) => ({
      ...prev,
      selectedTrain: train.name,
      amount: totalAmount,
      trainData: train
    }))
  }


  // RESET
  const handleReset = () => {
    setForm({
      from: '',
      to: '',
      journeyDate: '',
      quota: 'General',
      classType: 'SL',
      passengers: 1,
      selectedTrain: '',
      amount: '',
      mpin: ''
    })
    setTrains([])
    setTicketData(null)
    setSuccess('')
    setError('')
  }

  // BOOK TICKET
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (!form.selectedTrain) {
      return setError('Please select train')
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
      const token = user?.token || localStorage.getItem('token')
      const res = await API.post('/travel/train/book',
        {
          user_id: user?.id,
          from: form.from,
          to: form.to,
          journeyDate: form.journeyDate,
          quota: form.quota,
          classType: form.classType,
          passengers: form.passengers,
          selectedTrain: form.selectedTrain,
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
        res?.data?.balance !== undefined
          ? Number(res.data.balance)
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

      if (res.data.status) {
        setTicketData(res.data.ticket)
        setSuccess(res.data.message)
        fetchRecentBookings()
      } else {
        setError(res.data.message)
      }
      setLoading(false)
    } catch (err) {
      setLoading(false)
      setError(
        err?.response?.data?.message ||
        'Booking failed'
      )
    }
  }

  // DOWNLOAD TICKET
  const downloadTicket = async (bookingId) => {
    try {
      const token = user?.token || localStorage.getItem('token')
      const res = await API.get(`/travel/train/download/${bookingId}`,
        {
          responseType: 'blob'
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )
      const url = window.URL.createObjectURL(new Blob([res.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute(
        'download',
        `ticket-${bookingId}.pdf`
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError('Ticket download failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      <div className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">
          {/* SEARCH FORM */}
          <div className="bg-white rounded-3xl shadow-md p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="bg-blue-100 text-blue-700 p-4 rounded-2xl">
                  <Train />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">Train Booking</h2>
                  <p className="text-sm text-gray-500">Search & book train tickets</p>
                </div>
              </div>

              {/* BALANCE */}
              <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                <div className="flex items-center gap-3">
                  <Wallet className="text-green-600" />
                  <div>
                    <p className="text-xs text-gray-500">Main Balance</p>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg">
                        {
                          showBalance
                            ? `₹${totalBalance}`
                            : '••••••'
                        }
                      </h3>
                      <button
                        onClick={() =>
                          setShowBalance(!showBalance)
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

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* FROM TO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 relative">
                <div>
                  <label className="text-sm font-medium mb-2 block">From</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="from"
                      value={form.from}
                      onChange={handleChange}
                      placeholder="Enter source station"
                      className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">To</label>
                  <div className="relative">
                    <input
                      type="text"
                      name="to"
                      value={form.to}
                      onChange={handleChange}
                      placeholder="Enter destination station"
                      className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleSwap}
                  className="absolute left-1/2 top-[58px] -translate-x-1/2 bg-blue-600 text-white p-3 rounded-full hidden md:block"
                >
                  <ArrowRightLeft size={18} />
                </button>
              </div>

              {/* DATE */}

              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Journey Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="journeyDate"
                      value={form.journeyDate}
                      onChange={handleChange}
                      className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <CalendarDays
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
                <div>

                  <label className="text-sm font-medium mb-2 block">Passengers</label>
                  <div className="relative">
                    <input
                      type="number"
                      min="1"
                      max="6"
                      name="passengers"
                      value={form.passengers}
                      onChange={handleChange}
                      className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Users
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">Class</label>
                  <select
                    name="classType"
                    value={form.classType}
                    onChange={handleChange}
                    className="w-full border rounded-2xl p-4"
                  >
                    <option value="SL">Sleeper</option>
                    <option value="3A">AC 3 Tier</option>
                    <option value="2A">AC 2 Tier</option>
                    <option value="1A">First AC</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Quota</label>
                  <select
                    name="quota"
                    value={form.quota}
                    onChange={handleChange}
                    className="w-full border rounded-2xl p-4"
                  >
                    <option>General</option>
                    <option>Tatkal</option>
                    <option>Premium Tatkal</option>
                  </select>
                </div>
              </div>

              {/* SEARCH BUTTON */}
              <button
                type="button"
                onClick={handleSearchTrain}
                disabled={searchLoading}
                className="bg-blue-700 hover:bg-blue-800 text-white font-semibold px-6 py-4 rounded-2xl flex items-center justify-center gap-2 w-full"
              >
                <Search size={20} />
                {
                  searchLoading
                    ? 'Searching Trains...'
                    : 'Search Trains'
                }
              </button>
              {/* TRAINS */}

              {
                trains.length > 0 && (
                  <div className="space-y-4 pt-2">
                    {
                      trains.map((train) => (
                        <button
                          key={train.id}
                          type="button"
                          onClick={() =>
                            handleTrainSelect(train)
                          }
                          className={`w-full border rounded-3xl p-5 text-left transition-all ${form.selectedTrain === train.name
                            ? 'border-blue-500 bg-blue-50'
                            : ''
                            }`}
                        >
                          <div className="flex justify-between gap-5 flex-col lg:flex-row">
                            <div className="flex-1">
                              <div className="flex justify-between">
                                <div>
                                  <h3 className="font-bold text-lg">
                                    {train.name}
                                  </h3>

                                  <p className="text-sm text-gray-500">
                                    #{train.number}
                                  </p>
                                </div>
                                <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                                  <Star
                                    size={14}
                                    fill="currentColor"
                                  />
                                  {train.rating}
                                </div>
                              </div>
                              <div className="grid grid-cols-3 gap-4 mt-5">
                                <div>
                                  <p className="text-sm text-gray-500">
                                    Departure
                                  </p>
                                  <h4 className="font-bold">
                                    {train.departure}
                                  </h4>
                                </div>
                                <div className="text-center">
                                  <p className="text-sm text-gray-500">
                                    {train.duration}
                                  </p>
                                </div>

                                <div className="text-right">
                                  <p className="text-sm text-gray-500">
                                    Arrival
                                  </p>
                                  <h4 className="font-bold">
                                    {train.arrival}
                                  </h4>
                                </div>
                              </div>
                            </div>

                            <div className="lg:w-[180px]">
                              <h2 className="text-3xl font-bold text-blue-700">
                                ₹{train.price}
                              </h2>
                              <p className="text-green-600 text-sm mt-2">
                                {train.seats} seats available
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
                <label className="text-sm font-medium mb-2 block">
                  Ticket Amount
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
                <label className="text-sm font-medium mb-2 block">
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
              <div className="flex gap-4 flex-col md:flex-row">
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-green-700 hover:bg-green-800 text-white font-semibold px-6 py-4 rounded-2xl w-full"
                >
                  {
                    loading
                      ? 'Booking...'
                      : 'Book Ticket'
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
                  <p><strong>Booking ID:</strong> {ticketData.booking_id}</p>
                  <p><strong>Train:</strong> {ticketData.train_name} ({ticketData.train_number})</p>
                  <p><strong>Route:</strong> {ticketData.from_station} → {ticketData.to_station}</p>
                  <p><strong>Amount:</strong> ₹{ticketData.amount}</p>
                </div>
                <button
                  onClick={() => downloadTicket(ticketData.booking_id)}
                  className="bg-blue-700 hover:bg-blue-800 text-white w-full mt-5 px-5 py-4 rounded-2xl flex items-center justify-center gap-2"
                >
                  <Download size={20} />
                  Download Ticket
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
                recentBookings.filter(
                  (item) =>
                    item.travel_type === 'Train'
                ).length > 0 ? (

                recentBookings
                  .filter(
                    (item) =>
                      item.travel_type ===
                      'Train'
                  )
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.train_name} ({item.train_number})</h3>
                          <p className="text-xs text-gray-500">{item.from_station} → {item.to_station}</p>
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

export default TravelTrain