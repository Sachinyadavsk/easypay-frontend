import React from 'react';
import { Link } from 'react-router-dom';

const WalletCard = ({ userdetails }) => {
  return (
    <>
      {(userdetails || []).length === 0 ? (
        <div className="bg-gradient-to-r from-[#5F259F] to-[#7E3AF2] rounded-3xl p-8 text-white shadow-2xl">
          <p className="text-lg">Wallet Balance</p>
          <h1 className="text-5xl font-bold mt-3">₹0.00</h1>
        </div>
      ) : (
        <div className="bg-gradient-to-r from-[#5F259F] to-[#7E3AF2] rounded-3xl p-8 text-white shadow-2xl">
          <p className="text-lg">Wallet Balance</p>
          <h1 className="text-5xl font-bold mt-3">₹{userdetails.balance?.toFixed(2)}</h1>
          <div className="mt-6 flex justify-between items-center">
            <div>
              <p className="text-sm">UPI ID</p>
              <h3 className="font-bold">{userdetails.upiId}</h3>
              {/* userdetails mpin column no dispaly set or not if not then show setup mpin button */}
              {(userdetails.mpin === undefined || userdetails.mpin === null) ? (
                <p className="mt-4">
                  <Link to="/setup-mpin" className="bg-white text-[#5F259F] px-6 py-3 rounded-2xl font-bold">
                    Setup MPIN
                  </Link>
                </p>
              ) : null}
            </div>
            <Link to="/add/money/wallet" className="bg-white text-[#5F259F] px-6 py-3 rounded-2xl font-bold">
              Add Money
            </Link>
          </div>
        </div>
      )
      }
    </>
  )

}

export default WalletCard
