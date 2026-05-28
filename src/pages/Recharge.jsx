import React from 'react';

const Recharge = () => {
  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8">
        <h1 className="text-4xl font-bold mb-8">Mobile Recharge</h1>

        <div className="space-y-5">
          <input
            type="text"
            placeholder="Mobile Number"
            className="w-full border p-4 rounded-2xl"
          />

          <input
            type="text"
            placeholder="Amount"
            className="w-full border p-4 rounded-2xl"
          />

          <button className="w-full bg-[#5F259F] text-white py-4 rounded-2xl font-bold text-lg">
            Recharge Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Recharge
