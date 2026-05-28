import React from 'react';

const rewards = [
  {
    title: "Cashback Reward",
    amount: "₹100 Cashback",
  },
  {
    title: "Flight Offer",
    amount: "20% OFF",
  },
  {
    title: "Food Coupon",
    amount: "Free Delivery",
  },
];
const Rewards = () => {
  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-4xl font-bold mb-8">Rewards & Offers</h1>

      <div className="grid md:grid-cols-3 gap-8">
        {rewards.map((reward, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-[#5F259F] to-[#7E3AF2] text-white rounded-3xl p-8 shadow-2xl"
          >
            <h2 className="text-3xl font-bold mb-4">{reward.title}</h2>
            <p className="text-xl">{reward.amount}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Rewards
