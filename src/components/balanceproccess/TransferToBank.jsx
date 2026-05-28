import React, { useEffect, useState } from 'react'
import {
  Building2,
  Clock3,
  Eye,
  EyeOff,
  Plus,
  ArrowRightLeft
} from 'lucide-react'

import { useAuth } from '../../shared/context/AuthContext'
import API from '../../shared/api/axios'
import bcrypt from 'bcryptjs'

const TransferToBank = () => {

  const { user, setUser } = useAuth()

  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('account')
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Saved Banks
  const [savedBanks, setSavedBanks] = useState([])
  // Transactions
  const [transactions, setTransactions] = useState([])
  // Transfer Form
  const [form, setForm] = useState({
    bank: '',
    accountNumber: '',
    confirmAccountNumber: '',
    ifsc: '',
    receiverName: '',
    upiId: '',
    amount: '',
    remark: '',
    mpin: ''
  })

  // Add Bank Form
  const [newBank, setNewBank] = useState({
    bank: '',
    holder: '',
    account: '',
    ifsc: ''
  })

  // GET SAVED BANKS
  const fetchSavedBanks = async () => {
    try {
      const token = user?.token || localStorage.getItem('token')
      const res = await API.get('/bank/my-banks',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )
      if (res.data.success) {
        setSavedBanks(res.data.banks || [])
      }
    } catch (err) {
      console.log(err)
    }
  }


  // GET TRANSACTIONS
  const fetchTransactions = async () => {
    try {
      const token = user?.token || localStorage.getItem('token')
      const res = await API.get('/transactions/historyall',
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (res.data.success) {
        setTransactions(res.data.transactions || [])
      }

    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    fetchSavedBanks()
    fetchTransactions()
  }, [])


  // INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target
    // Amount
    if (name === 'amount') {
      const cleaned = value.replace(/[^0-9.]/g, '')
      setForm((prev) => ({
        ...prev,
        amount: cleaned
      }))

      return
    }

    // Account Number
    if (name === 'accountNumber' || name === 'confirmAccountNumber') {
      const cleaned = value.replace(/\D/g, '')
      setForm((prev) => ({
        ...prev,
        [name]: cleaned
      }))
      return
    }

    // MPIN
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

    // IFSC
    if (name === 'ifsc') {
      setForm((prev) => ({
        ...prev,
        ifsc: value.toUpperCase()
      }))
      return
    }

    setForm((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  // NEW BANK INPUTS
  const handleNewBank = (e) => {
    const { name, value } = e.target
    setNewBank((prev) => ({
      ...prev,
      [name]: value
    }))
  }


  // ADD NEW BANK
  const addBankAccount = async () => {
    setError('')
    setSuccess('')
    if (!newBank.bank || !newBank.holder || !newBank.account || !newBank.ifsc) {
      return setError('Please fill all bank details')
    }

    try {
      setLoading(true)
      const token = user?.token || localStorage.getItem('token')
      const res = await API.post('/bank/add', newBank,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (res.data.success) {
        setSavedBanks((prev) => [
          ...prev,
          res.data.bank
        ])
        setSuccess('Bank account added successfully')

        setNewBank({
          bank: '',
          holder: '',
          account: '',
          ifsc: ''
        })
      }

    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Failed to add bank account'
      )
    } finally {
      setLoading(false)
    }
  }


  // TRANSFER MONEY

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Amount Validation
    if (!form.amount || Number(form.amount) <= 0) {
      return setError('Please enter valid amount')
    }

    // Balance Validation
    if (Number(form.amount) > Number(user?.balance || 0)) {
      return setError('Insufficient balance')
    }

    // MPIN Validation
    if (!form.mpin || form.mpin.length !== 4) {
      return setError('Please enter valid MPIN')
    }

    try {
      setLoading(true)
      // VERIFY MPIN
      const isMatch = await bcrypt.compare(form.mpin, user?.mpin)
      if (!isMatch) {
        setLoading(false)
        return setError('Invalid MPIN')
      }

      // VALIDATIONS

      // ACCOUNT TRANSFER
      if (activeTab === 'account') {
        if (!form.bank || !form.accountNumber || !form.confirmAccountNumber || !form.ifsc || !form.receiverName) {
          return setError('Please fill all bank details')
        }

        if (form.accountNumber !== form.confirmAccountNumber) {
          return setError('Account number mismatch')
        }
      }

      // UPI TRANSFER
      if (activeTab === 'upi') {
        if (!form.upiId || !form.upiId.includes('@')) {
          return setError('Invalid UPI ID')
        }
      }

      // SELF TRANSFER
      if (activeTab === 'self') {
        if (!form.bank) {
          return setError('Please select bank account')
        }
      }

      // API URL
      let url = ''
      // Payload
      let payload = {
        amount: Number(form.amount),
        remark: form.remark,
        mpin: form.mpin,
      }

      // Account Transfer
      if (activeTab === 'account') {
        url = '/transactions/bank-transfer'
        payload = {
          ...payload,
          bank: form.bank,
          accountNumber: form.accountNumber,
          ifsc: form.ifsc,
          receiverName: form.receiverName
        }
      }

      // UPI Transfer
      if (activeTab === 'upi') {
        url = '/transactions/upi-transfer'
        payload = {
          ...payload,
          upiId: form.upiId
        }
      }

      // Self Transfer
      if (activeTab === 'self') {
        url = '/transactions/self-transfer'
        payload = {
          ...payload,
          bank: form.bank
        }
      }


      // API REQUEST
      const token = user?.token || localStorage.getItem('token')
      const res = await API.post(url, payload,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (res.data.success) {
        // Update Balance
        const updatedBalance = Number(user?.balance || 0) - Number(form.amount)
        const updatedUser = {
          ...user,
          balance: updatedBalance
        }
        setUser(updatedUser)
        localStorage.setItem(
          'user',
          JSON.stringify(updatedUser)
        )
        setSuccess(res.data.message || 'Transfer successful')
        // Add Transaction
        setTransactions((prev) => [
          {
            id: Date.now(),
            type:
              activeTab === 'account'
                ? 'Bank Transfer'
                : activeTab === 'upi'
                  ? 'UPI Transfer'
                  : 'Self Transfer',

            name:
              activeTab === 'upi'
                ? form.upiId
                : form.receiverName || form.bank,

            amount: form.amount,
            time: 'Just Now'
          },
          ...prev
        ])

        // Reset Form
        setForm({
          bank: '',
          accountNumber: '',
          confirmAccountNumber: '',
          ifsc: '',
          receiverName: '',
          upiId: '',
          amount: '',
          remark: '',
          mpin: ''
        })
      }

    } catch (err) {
      setError(err?.response?.data?.message || 'Transfer failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">
        
          {/* TRANSFER FORM */}
          <div className="bg-white rounded-3xl shadow-md p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-100 text-purple-700 p-4 rounded-2xl">
                <ArrowRightLeft />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Bank Transfers</h2>
                <p className="text-sm text-gray-500">Instant secure money transfer</p>
              </div>
            </div>

            {/* TABS */}
            <div className="grid grid-cols-3 gap-3 mb-6">
              <button onClick={() => setActiveTab('account')} className={`p-4 rounded-2xl font-semibold ${activeTab === 'account'
                ? 'bg-purple-700 text-white'
                : 'bg-gray-100'
                }`}
              >
                Transfer To Account
              </button>

              <button onClick={() => setActiveTab('upi')} className={`p-4 rounded-2xl font-semibold ${activeTab === 'upi'
                ? 'bg-purple-700 text-white'
                : 'bg-gray-100'
                }`}
              >
                Transfer To UPI
              </button>

              <button onClick={() => setActiveTab('self')} className={`p-4 rounded-2xl font-semibold ${activeTab === 'self'
                ? 'bg-purple-700 text-white'
                : 'bg-gray-100'
                }`}
              >
                Self Transfer
              </button>

            </div>

            {/* ALERTS */}
            {
              success && (
                <div className="bg-green-100 text-green-700 border border-green-300 rounded-2xl p-4 mb-4">
                  {success}
                </div>
              )
            }

            {
              error && (
                <div className="bg-red-100 text-red-700 border border-red-300 rounded-2xl p-4 mb-4">
                  {error}
                </div>
              )
            }

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* ACCOUNT */}
              {
                activeTab === 'account' && (
                  <>

                    <input
                      type="text"
                      name="bank"
                      value={form.bank}
                      onChange={handleChange}
                      placeholder="Bank Name"
                      className="w-full border rounded-2xl p-4"
                    />

                    <input
                      type="text"
                      name="accountNumber"
                      value={form.accountNumber}
                      onChange={handleChange}
                      placeholder="Account Number"
                      className="w-full border rounded-2xl p-4"
                    />

                    <input
                      type="text"
                      name="confirmAccountNumber"
                      value={form.confirmAccountNumber}
                      onChange={handleChange}
                      placeholder="Confirm Account Number"
                      className="w-full border rounded-2xl p-4"
                    />

                    <input
                      type="text"
                      name="ifsc"
                      value={form.ifsc}
                      onChange={handleChange}
                      placeholder="IFSC Code"
                      className="w-full border rounded-2xl p-4"
                    />

                    <input
                      type="text"
                      name="receiverName"
                      value={form.receiverName}
                      onChange={handleChange}
                      placeholder="Receiver Name"
                      className="w-full border rounded-2xl p-4"
                    />

                  </>
                )
              }

              {/* UPI */}
              {
                activeTab === 'upi' && (
                  <input
                    type="text"
                    name="upiId"
                    value={form.upiId}
                    onChange={handleChange}
                    placeholder="Enter UPI ID"
                    className="w-full border rounded-2xl p-4"
                  />
                )
              }

              {/* SELF */}
              {
                activeTab === 'self' && (
                  <select
                    name="bank"
                    value={form.bank}
                    onChange={handleChange}
                    className="w-full border rounded-2xl p-4"
                  >

                    <option value="">
                      Select Bank Account
                    </option>

                    {
                      savedBanks.map((bank) => (
                        <option
                          key={bank._id}
                          value={bank.bank}
                        >
                          {bank.bank} • {bank.account}
                        </option>
                      ))
                    }

                  </select>
                )
              }

              {/* AMOUNT */}
              <input
                type="text"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="Enter Amount"
                className="w-full border rounded-2xl p-4"
              />

              {/* REMARK */}
              <textarea
                rows="3"
                name="remark"
                value={form.remark}
                onChange={handleChange}
                placeholder="Remark"
                className="w-full border rounded-2xl p-4"
              />

              {/* MPIN */}
              <input
                type="password"
                name="mpin"
                value={form.mpin}
                onChange={handleChange}
                placeholder="Enter MPIN"
                className="w-full border rounded-2xl p-4"
                maxLength="4"
              />

              {/* BUTTON */}
              <button
                type="submit"
                disabled={loading}
                className="bg-purple-700 hover:bg-purple-800 text-white w-full p-4 rounded-2xl font-semibold"
              >
                {
                  loading
                    ? 'Processing...'
                    : 'Transfer Now'
                }
              </button>

            </form>

          </div>

          {/* ADD BANK */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <div className="flex items-center gap-3 mb-5">

              <div className="bg-green-100 text-green-700 p-3 rounded-2xl">
                <Plus />
              </div>

              <h2 className="text-2xl font-bold">
                Add Another Bank A/c
              </h2>

            </div>

            <div className="space-y-4">

              <input
                type="text"
                name="bank"
                value={newBank.bank}
                onChange={handleNewBank}
                placeholder="Bank Name"
                className="w-full border rounded-2xl p-4"
              />

              <input
                type="text"
                name="holder"
                value={newBank.holder}
                onChange={handleNewBank}
                placeholder="Account Holder Name"
                className="w-full border rounded-2xl p-4"
              />

              <input
                type="text"
                name="account"
                value={newBank.account}
                onChange={handleNewBank}
                placeholder="Account Number"
                className="w-full border rounded-2xl p-4"
              />

              <input
                type="text"
                name="ifsc"
                value={newBank.ifsc}
                onChange={handleNewBank}
                placeholder="IFSC Code"
                className="w-full border rounded-2xl p-4"
              />

              <button
                onClick={addBankAccount}
                className="bg-green-600 hover:bg-green-700 text-white w-full p-4 rounded-2xl font-semibold"
              >
                Add Bank Account
              </button>

            </div>

          </div>

        </div>

        {/* RIGHT */}
        <div className="space-y-6">

          {/* SAVED BANKS */}
          <div className="bg-white rounded-3xl shadow-md p-6">

            <h2 className="text-xl font-bold mb-5">
              Saved Bank Accounts
            </h2>

            <div className="space-y-4">

              {
                savedBanks.map((bank) => (

                  <div
                    key={bank._id}
                    className="border rounded-2xl p-4"
                  >

                    <div className="flex items-center gap-3 mb-2">

                      <div className="bg-purple-100 text-purple-700 p-2 rounded-xl">
                        <Building2 size={18} />
                      </div>

                      <div>

                        <h3 className="font-semibold">
                          {bank.bank}
                        </h3>

                        <p className="text-sm text-gray-500">
                          {bank.account}
                        </p>

                      </div>

                    </div>

                    <p className="text-sm text-gray-500">
                      {bank.holder}
                    </p>

                  </div>

                ))
              }

            </div>

          </div>

          {/* TRANSACTIONS */}
          <div className="bg-white rounded-3xl shadow-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-bold">Recent Transfers</h2>
              <Clock3 size={18} />
            </div>
            <div className="space-y-4 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
              {
                transactions
                  .filter(
                    (item) =>
                      item.type === "Bank_Transfer" || item.type === "UPI_Transfer" || item.type === "Self_Transfer"
                  )
                  .map((item) => (
                    <div key={item._id || item.id} className="flex items-center justify-between border-b pb-4">
                      <div>
                        <h3 className="font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-xs text-gray-500">{item.type}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-red-600">
                          ₹ {Number(item.amount).toFixed(2)}
                        </p>

                        <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-1">
                          <Clock3 className="w-3 h-3" />
                          {new Date(item.createdAt || item.date).toLocaleString()}
                        </p>
                      </div>
                    </div>

                  ))
              }

            </div>

          </div>

        </div>

      </div>

    </div>
  )
}

export default TransferToBank