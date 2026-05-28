import React from 'react';
import { Route, Routes } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Home from './pages/Home';

import Transfer from './pages/Transfer';
import Rewards from './pages/Rewards';
import Profile from './pages/Profile';
import Notifications from './pages/Notifications';
import TransactionTable from './components/TransactionTable';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Mpin from './components/auth/Mpin';
import Dashboard from './components/auth/Dashboard';
import Wallet from './components/auth/Wallet';
import MpinLogin from './components/auth/MpinLogin';
import TransferToMobile from './components/balanceproccess/TransferToMobile';
import TransferToBank from './components/balanceproccess/TransferToBank';
import TransferScananyOr from './components/balanceproccess/TransferScananyOr';
import CheckBalance from './components/balanceproccess/CheckBalance';
import MobileRecharge from './pages/sevices/MobileRecharge';
import ElectricityBill from './pages/sevices/ElectricityBill'
import DthRecharge from './pages/sevices/DthRecharge';
import WaterBill from './pages/sevices/WaterBill';
import Insurance from './pages/sevices/Insurance';
import LoanEmiPayment from './pages/sevices/LoanEmiPayment';
import Fastag from './pages/sevices/Fastag';
import Investments from './pages/sevices/Investments'
import TravelHotels from './pages/travel/TravelHotels'
import TravelFlight from './pages/travel/TravelFlight'
import TravelTrain from './pages/travel/TravelTrain'
import TravelBus from './pages/travel/TravelBus'
import Logout from './components/auth/Logout';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="/transfer" element={<Transfer />} />
        <Route path="/rewards" element={<Rewards />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/transactions" element={<TransactionTable />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/setup-mpin" element={<Mpin />} />
        <Route path="/add/money/wallet" element={<Wallet />} />
        <Route path="/mpin/login" element={<MpinLogin />} />
        <Route path="/users/logout" element={<Logout />} />


        {/* Money Transfers */}
        <Route path="/transfer-to-mobile" element={<TransferToMobile />} />
        <Route path="/transfer-to-bank" element={<TransferToBank />} />
        <Route path="/transfer-scan-anyor" element={<TransferScananyOr />} />
        <Route path="/check-balance" element={<CheckBalance />} />


        {/* services */}
        <Route path="/mobile-recharge" element={<MobileRecharge />} />
        <Route path="/electricity-bill" element={<ElectricityBill />} />
        <Route path="/dth" element={<DthRecharge />} />
        <Route path="/water-bill" element={<WaterBill />} />
        <Route path="/insurance" element={<Insurance />} />
        <Route path="/loan-emi-payment" element={<LoanEmiPayment />} />
        <Route path="/fastag" element={<Fastag />} />
        <Route path="/investments" element={<Investments />} />

        {/* Travel & Tickets */}
        <Route path="/travel-hotels" element={<TravelHotels />} />
        <Route path="/travel-flight" element={<TravelFlight />} />
        <Route path="/travel-train" element={<TravelTrain />} />
        <Route path="/travel-bus" element={<TravelBus />} />

      </Route>
    </Routes>
  )
}

export default App
