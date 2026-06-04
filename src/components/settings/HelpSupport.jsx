import React, { useEffect, useState } from 'react'
import {
  Headphones,
  MessageSquare,
  HelpCircle,
  Search,
  ChevronDown,
  ChevronUp,
  Send,
  Loader2,
  AlertCircle,
} from 'lucide-react'

import API from '../../shared/api/axios'
import { useAuth } from '../../shared/context/AuthContext'

const HelpSupport = () => {
  const { user } = useAuth()

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [faqs, setFaqs] = useState([])
  const [tickets, setTickets] = useState([])
  const [search, setSearch] = useState('')
  const [openFaq, setOpenFaq] = useState(null)

  const [ticketForm, setTicketForm] = useState({
    subject: '',
    message: '',
  })

  const features = [
    {
      title: 'Customer Support',
      description: '24×7 customer assistance',
      icon: Headphones,
      bg: 'bg-blue-50',
      color: 'text-blue-600',
    },
    {
      title: 'Your Queries',
      description: 'Manage support tickets',
      icon: MessageSquare,
      bg: 'bg-green-50',
      color: 'text-green-600',
    },
    {
      title: 'FAQs',
      description: 'Frequently asked questions',
      icon: HelpCircle,
      bg: 'bg-purple-50',
      color: 'text-purple-600',
    },
  ]

  useEffect(() => {
    fetchFaqs()
    fetchTickets()
  }, [])

  const fetchFaqs = async () => {
    try {
      const res = await API.get('/support/faqs')

      if (res.data.status === 'success') {
        setFaqs(res.data.faqs || [])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const fetchTickets = async () => {
    try {
      const token =
        user?.token ||
        localStorage.getItem('token')

      const res = await API.get(
        '/support/tickets',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.status === 'success') {
        setTickets(res.data.tickets || [])
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleChange = (e) => {
    setTicketForm({
      ...ticketForm,
      [e.target.name]: e.target.value,
    })
  }

  const createTicket = async (e) => {
    e.preventDefault()

    setError('')
    setSuccess('')

    if (!ticketForm.subject) {
      return setError('Subject required')
    }

    if (!ticketForm.message) {
      return setError('Message required')
    }

    try {
      setLoading(true)

      const token =
        user?.token ||
        localStorage.getItem('token')

      const res = await API.post(
        '/support/ticket',
        ticketForm,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      )

      if (res.data.status === 'success') {
        setSuccess(
          'Support ticket submitted successfully'
        )

        setTicketForm({
          subject: '',
          message: '',
        })

        fetchTickets()
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
        'Failed to submit ticket'
      )
    } finally {
      setLoading(false)
    }
  }

  const filteredFaqs = faqs.filter((faq) =>
    faq.question
      ?.toLowerCase()
      .includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50">

      <div className=" text-black/90">

        <div className="max-w-7xl mx-auto px-4 py-8">

          <h1 className="text-3xl font-bold">
            Help & Support
          </h1>

          <p className="text-gray-500 mt-2">
            Customer Support, Queries & FAQs
          </p>

        </div>

      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">

        {/* Features */}

        <div className="grid md:grid-cols-3 gap-4">

          {features.map((item, index) => {
            const Icon = item.icon

            return (
              <div
                key={index}
                className="bg-white rounded-3xl p-5 shadow-sm"
              >
                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${item.bg}`}
                >
                  <Icon
                    className={item.color}
                    size={28}
                  />
                </div>

                <h3 className="font-bold mt-4">
                  {item.title}
                </h3>

                <p className="text-gray-500 text-sm mt-1">
                  {item.description}
                </p>
              </div>
            )
          })}

        </div>

        {/* Ticket Form */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <h2 className="font-bold text-xl mb-4">
            Raise Support Ticket
          </h2>

          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 text-green-600 p-3 rounded-xl mb-4">
              {success}
            </div>
          )}

          <form
            onSubmit={createTicket}
            className="space-y-4"
          >

            <input
              type="text"
              name="subject"
              value={ticketForm.subject}
              onChange={handleChange}
              placeholder="Subject"
              className="w-full border rounded-2xl p-4"
            />

            <textarea
              rows="4"
              name="message"
              value={ticketForm.message}
              onChange={handleChange}
              placeholder="Describe your issue"
              className="w-full border rounded-2xl p-4"
            />

            <button
              type="submit"
              disabled={loading}
              className="bg-[#5F259F] text-white px-6 py-3 rounded-2xl flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="animate-spin" />
              ) : (
                <Send size={18} />
              )}

              Submit Ticket
            </button>

          </form>

        </div>

        {/* FAQ */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <h2 className="font-bold text-xl mb-4">
            FAQs
          </h2>

          <div className="relative mb-4">

            <Search
              size={18}
              className="absolute left-4 top-4 text-gray-400"
            />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search FAQ..."
              className="w-full border rounded-2xl pl-12 p-4"
            />

          </div>

          <div className="space-y-3">

            {filteredFaqs.map(
              (faq, index) => (
                <div
                  key={faq._id || index}
                  className="border rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() =>
                      setOpenFaq(
                        openFaq === index
                          ? null
                          : index
                      )
                    }
                    className="w-full flex justify-between items-center p-4 text-left"
                  >
                    <span className="font-medium">
                      {faq.question}
                    </span>

                    {openFaq === index ? (
                      <ChevronUp />
                    ) : (
                      <ChevronDown />
                    )}
                  </button>

                  {openFaq === index && (
                    <div className="px-4 pb-4 text-gray-600">
                      {faq.answer}
                    </div>
                  )}
                </div>
              )
            )}

          </div>

        </div>

        {/* Ticket History */}

        <div className="bg-white rounded-3xl p-6 shadow-sm">

          <h2 className="font-bold text-xl mb-4">
            Your Queries
          </h2>

          {tickets.length > 0 ? (
            <div className="space-y-4">

              {tickets.map(
                (ticket, index) => (
                  <div
                    key={index}
                    className="border rounded-2xl p-4"
                  >
                    <h3 className="font-semibold">
                      {ticket.subject}
                    </h3>

                    <p className="text-sm text-gray-500 mt-1">
                      {ticket.message}
                    </p>

                    <span className="inline-block mt-3 bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs">
                      {ticket.status ||
                        'Open'}
                    </span>
                  </div>
                )
              )}

            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No support queries found
            </div>
          )}

        </div>

      </div>

    </div>
  )
}

export default HelpSupport