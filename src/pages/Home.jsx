import React from 'react';
import WalletCard from "../components/WalletCard";
import ServiceCard from "../components/ServiceCard";
import TransactionTable from "../components/TransactionTable";
import { Link } from 'react-router-dom';
import { useAuth } from '../shared/context/AuthContext';
import { useState } from 'react';
import { useEffect } from 'react';
import API from '../shared/api/axios';
import quickActions from '../static-api/transfers.jsx';
import sliderData from '../static-api/sliderData.jsx';
import services from '../static-api/ServiceData.jsx';
import TravelData from '../static-api/TravelData.jsx';


const Home = () => {
  const { user, setUser } = useAuth();

  // using  the service api to fetch the services and display on the home page
  //  set condition where if user is not logged in, redirect to login page button and link click check login status and if not logged in, redirect to login page
  // only button click and link click check login status and if not logged in, redirect to login page all features display but when click on any feature check login status and if not logged in, redirect to login page
  const handleFeatureClick = (link, button) => {
    if (!user) {
      alert("Please login to access this feature.");
      window.location.href = "/mpin/login";
    } else {
      window.location.href = link;
    }
  }
  return (
    <div className="max-w-7xl mx-auto p-4 space-y-10">
      {/* Wallet Card */}
      <WalletCard userdetails={user} />

      {/* Slider */}
      <div className="grid md:grid-cols-3 gap-6">
        {sliderData.map((slide, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-[#5F259F] to-[#7E3AF2] rounded-3xl p-8 text-white shadow-xl"
          >
            <h2 className="text-3xl font-bold mb-4">
              {slide.title}
            </h2>

            <p className="text-lg text-gray-100 leading-relaxed">
              {slide.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Money Transfer */}
      <div className="bg-white rounded-3xl shadow-xl p-6 md:p-8">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold">
            Money Transfers
          </h2>

          <button onClick={() => handleFeatureClick("/transfer-to-mobile", "View All")} className="text-[#5F259F] font-bold">
            View All
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {quickActions.map((item, index) => (
            <Link to={item.link} key={index} onClick={() => handleFeatureClick(item.link, item.title)}>
              <div
                key={index}
                className="bg-gray-100 rounded-3xl p-6 text-center hover:shadow-lg transition cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full bg-[#5F259F] text-white flex items-center justify-center mx-auto text-4xl mb-4 shadow-lg">
                  {item.icon}
                </div>

                <h3 className="font-bold text-lg leading-snug">
                  {item.title}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recharge & Bill Payments */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            Recharge & Pay Bills
          </h2>

          <button onClick={() => handleFeatureClick("/recharge", "More")} className="text-[#5F259F] font-bold">
            More
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {services.length > 0 ? (
            services.map((ser, index) => (
              <ServiceCard
                key={index}
                link={ser.link}
                onClick={() => handleFeatureClick(ser.link, ser.title)}
                icon={ser.icon}
                title={ser.title}
              />
            ))
          ) : (
            <p>No services available.</p>
          )}
        </div>
      </div>

      {/*  Travel & Tickets */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold">
            Travel & Tickets
          </h2>

          <button onClick={() => handleFeatureClick("/recharge", "More")} className="text-[#5F259F] font-bold">
            More
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {TravelData.length > 0 ? (
            TravelData.map((ser, index) => (
              <ServiceCard
                key={index}
                link={ser.link}
                onClick={() => handleFeatureClick(ser.link, ser.title)}
                icon={ser.icon}
                title={ser.title}
              />
            ))
          ) : (
            <p>No services available.</p>
          )}
        </div>
      </div>



      {/* Cashback Banner */}
      <div className="bg-gradient-to-r from-pink-500 to-orange-400 rounded-3xl p-8 text-white shadow-2xl">
        <div className="grid md:grid-cols-2 items-center gap-8">
          <div>
            <h2 className="text-4xl font-bold mb-4">
              Win Cashback Every Day
            </h2>

            <p className="text-lg text-gray-100 leading-relaxed mb-6">
              Use PhonePe for recharge and utility bills to earn exciting rewards.
            </p>

            <button onClick={() => handleFeatureClick("/cashback", "Explore Offers")} className="bg-white text-pink-600 px-8 py-4 rounded-2xl font-bold shadow-lg">
              Explore Offers
            </button>
          </div>

          <div className="text-center text-8xl">
            🎁
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
