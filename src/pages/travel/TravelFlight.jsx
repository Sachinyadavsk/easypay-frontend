import { useEffect, useState } from 'react'
import {
  Plane,
  MapPin,
  Calendar,
  Users,
  ShieldCheck,
  Clock3,
  Star,
  CheckCircle2,
  Ticket,
  Wallet,
  ArrowRightLeft,
  Download,
  Search,
  Loader2
} from 'lucide-react'
import { useAuth } from '../../shared/context/AuthContext'
import API from '../../shared/api/axios'



const TravelFlight = () => {

  const { user, setUser } = useAuth()
  const [loading, setLoading] = useState(false)
  const [searchLoading, setSearchLoading] = useState(false)
  const [flights, setFlights] = useState([])
  const [recentBookings, setRecentBookings] = useState([])
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [form, setForm] = useState({
    from: '',
    to: '',
    departureDate: '',
    passengers: 1,
    classType: 'Economy',
    selectedFlight: '',
    departure: '',
    arrival: '',
    duration: '',
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
      const res = await API.get(`/travel/flight/recent-bookings/${user_id_value}`,
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
    // MPIN VALIDATION
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


  // SEARCH FLIGHTS
  const searchFlights = async () => {
    setError('')
    setSuccess('')
    if (!form.from) {
      return setError('Please enter departure city')
    }

    if (!form.to) {
      return setError('Please enter destination city')
    }

    if (!form.departureDate) {
      return setError('Please select departure date')
    }

    try {
      setSearchLoading(true)
      const token = user?.token || localStorage.getItem('token')
      const response = await API.post('/travel/flight/search',
        {
          from: form.from,
          to: form.to,
          departureDate: form.departureDate,
          passengers: form.passengers
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.status) {
        setFlights(response.data.flights)
        setSuccess('Flights found successfully')
      } else {
        setError(response.data.message)
      }
      setSearchLoading(false)
    } catch (err) {
      setSearchLoading(false)
      setError(err?.response?.data?.message || 'Flight search failed'
      )
    }
  }


  // SELECT FLIGHT
  const selectFlight = (flight) => {
    setForm((prev) => ({
      ...prev,
      selectedFlight: flight.airline,
      departure: flight.departure,
      arrival: flight.arrival,
      duration: flight.duration,
      amount: flight.price
    }))
  }


  // BOOK FLIGHT
  const handleSubmit =
    async (e) => {
      e.preventDefault()
      setError('')
      setSuccess('')
      if (!form.selectedFlight) {
        return setError('Please select flight')
      }
      if (form.mpin.length !== 4) {
        return setError('Please enter valid MPIN')
      }
      if (Number(form.amount) > Number(user?.balance || 0)) {
        return setError('Insufficient balance')
      }

      try {
        setLoading(true)
        const currentBalance = parseFloat(user?.balance || 0);
        const addAmount = parseFloat(form.amount || 0);
        const token = user?.token || localStorage.getItem('token')
        const response = await API.post('/travel/flight/book',
          {
            from: form.from,
            to: form.to,
            departureDate: form.departureDate,
            passengers: form.passengers,
            classType: form.classType,
            selectedFlight: form.selectedFlight,
            departure: form.departure,
            arrival: form.arrival,
            duration: form.duration,
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
        setLoading(false)
      } catch (err) {
        setLoading(false)
        setError(
          err?.response?.data?.message || 'Flight booking failed'
        )
      }
    }



  // RESET
  const handleReset = () => {
    setForm({
      from: '',
      to: '',
      departureDate: '',
      passengers: 1,
      classType: 'Economy',
      selectedFlight: '',
      departure: '',
      arrival: '',
      duration: '',
      amount: '',
      mpin: ''
    })
    setFlights([])
  }

  // DOWNLOAD TICKET
  const downloadTicket = async (bookingId) => {
    try {
      const token = user?.token || localStorage.getItem('token')
      const res = await API.get(`/travel/flight/download/${bookingId}`,
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
        `flight-${bookingId}.pdf`
      )
      document.body.appendChild(link)
      link.click()
      link.remove()
    } catch (err) {
      setError('Ticket download failed')
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT SECTION */}
        <div className="lg:col-span-2 space-y-6">

          <div className="bg-white rounded-3xl shadow-md p-6">

            {/* HEADER */}
            <div className="flex items-center gap-4 mb-6">

              <div className="bg-sky-100 text-sky-600 p-4 rounded-2xl">
                <Plane />
              </div>

              <div>

                <h2 className="text-2xl font-bold text-gray-800">
                  Flight Ticket Booking
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Book domestic and international flights
                </p>

              </div>

            </div>


            {/* ALERTS */}
            {
              error &&
              <div className="bg-red-100 text-red-600 p-4 rounded-2xl mb-4">
                {error}
              </div>
            }

            {
              success &&
              <div className="bg-green-100 text-green-600 p-4 rounded-2xl mb-4">
                {success}
              </div>
            }


            {/* FORM */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* FROM TO */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    From
                  </label>

                  <div className="relative">

                    <input
                      type="text"
                      name="from"
                      value={form.from}
                      onChange={handleChange}
                      placeholder="Departure City"
                      className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-sky-500"
                    />

                    <MapPin
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    To
                  </label>

                  <div className="relative">

                    <input
                      type="text"
                      name="to"
                      value={form.to}
                      onChange={handleChange}
                      placeholder="Destination City"
                      className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-sky-500"
                    />

                    <ArrowRightLeft
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                  </div>

                </div>

              </div>


              {/* DATE PASSENGERS */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Departure Date
                  </label>

                  <div className="relative">

                    <input
                      type="date"
                      name="departureDate"
                      value={form.departureDate}
                      onChange={handleChange}
                      className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-sky-500"
                    />

                    <Calendar
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
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
                      className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-sky-500"
                    />

                    <Users
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    />

                  </div>

                </div>

                <div>

                  <label className="block text-sm font-medium mb-2">
                    Class
                  </label>

                  <select
                    name="classType"
                    value={form.classType}
                    onChange={handleChange}
                    className="w-full border rounded-2xl p-4 outline-none focus:ring-2 focus:ring-sky-500"
                  >
                    <option>
                      Economy
                    </option>

                    <option>
                      Business
                    </option>

                    <option>
                      First Class
                    </option>

                  </select>

                </div>

              </div>


              {/* SEARCH BUTTON */}
              <button
                type="button"
                onClick={searchFlights}
                disabled={searchLoading}
                className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-4 rounded-2xl w-full font-semibold flex items-center justify-center gap-2"
              >
                {
                  searchLoading
                    ? <Loader2 className="animate-spin" />
                    : <Search />
                }

                {
                  searchLoading
                    ? 'Searching Flights...'
                    : 'Search Flights'
                }
              </button>


              {/* FLIGHTS */}
              {
                flights.length > 0 &&

                <div className="space-y-4">

                  {
                    flights.map((flight) => (

                      <button
                        key={flight.id}
                        type="button"
                        onClick={() =>
                          selectFlight(
                            flight
                          )
                        }
                        className={`w-full border rounded-2xl p-5 text-left transition-all ${form.selectedFlight ===
                          flight.airline
                          ? 'border-sky-500 bg-sky-50'
                          : ''
                          }`}
                      >

                        <div className="flex justify-between items-center">

                          <div>

                            <h3 className="font-bold text-lg">
                              {
                                flight.airline
                              }
                            </h3>

                            <p className="text-sm text-gray-500 mt-1">
                              {
                                flight.departure
                              }
                              {' '}
                              →
                              {' '}
                              {
                                flight.arrival
                              }
                            </p>

                            <p className="text-sm text-gray-500">
                              {
                                flight.duration
                              }
                            </p>

                          </div>

                          <div className="text-right">

                            <div className="flex items-center justify-end gap-1 text-yellow-500 mb-2">

                              <Star
                                size={16}
                                fill="currentColor"
                              />

                              <span>
                                {
                                  flight.rating
                                }
                              </span>

                            </div>

                            <h3 className="font-bold text-sky-600 text-xl">
                              ₹
                              {
                                flight.price
                              }
                            </h3>

                          </div>

                        </div>

                      </button>
                    ))
                  }

                </div>
              }


              {/* MPIN */}
              <div>

                <label className="block text-sm font-medium mb-2">
                  4 Digit MPIN
                </label>

                <div className="relative">

                  <input
                    type="password"
                    name="mpin"
                    value={form.mpin}
                    onChange={handleChange}
                    maxLength="4"
                    placeholder="Enter MPIN"
                    className="w-full border rounded-2xl p-4 pl-12 outline-none focus:ring-2 focus:ring-sky-500"
                  />

                  <ShieldCheck
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                  />

                </div>

              </div>


              {/* BUTTONS */}
              <div className="flex gap-4">

                <button
                  type="submit"
                  disabled={loading}
                  className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-4 rounded-2xl w-full font-semibold"
                >
                  {
                    loading
                      ? 'Processing...'
                      : 'Book Flight'
                  }
                </button>

                <button
                  type="button"
                  onClick={handleReset}
                  className="border border-gray-300 px-6 py-4 rounded-2xl w-full font-semibold"
                >
                  Reset
                </button>

              </div>

            </form>

          </div>

        </div>


        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">

          {/* WALLET */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-purple-100 text-purple-600 p-3 rounded-2xl">
                <Wallet />
              </div>

              <h2 className="text-xl font-bold">
                Flight Wallet
              </h2>

            </div>

            <div className="flex justify-between">

              <span>
                Wallet Balance
              </span>

              <span className="font-bold text-green-600">
                ₹
                {
                  Number(
                    user?.balance || 0
                  ).toFixed(2)
                }
              </span>

            </div>

          </div>


          {/* RECENT BOOKINGS */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center justify-between mb-5">

              <h2 className="text-xl font-bold">
                Recent Flights
              </h2>

              <Clock3 size={18} />

            </div>

            <div className="space-y-4 overflow-y-auto max-h-[340px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {recentBookings.length > 0 &&
                recentBookings.filter(
                  (item) =>
                    item.travel_type === 'Airplane'
                ).length > 0 ? (

                recentBookings
                  .filter(
                    (item) =>
                      item.travel_type ===
                      'Airplane'
                  )
                  .map((item, index) => (
                    <div key={index} className="flex items-center justify-between border-b pb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-green-100 text-green-600 p-2 rounded-xl">
                          <CheckCircle2 size={18} />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.train_name} ({item.class_type})</h3>
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

export default TravelFlight