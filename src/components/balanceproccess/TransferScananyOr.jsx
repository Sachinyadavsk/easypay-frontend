import React, { useEffect, useRef, useState } from 'react';
import {
    Smartphone,
    User,
    IndianRupee,
    Send,
    Clock3,
    CheckCircle2,
    Search,
    ShieldCheck,
    QrCode,
    ScanLine,
    XCircle,
    Camera,
} from 'lucide-react';
import jsQR from "jsqr";
import API from '../../shared/api/axios';
import { useAuth } from '../../shared/context/AuthContext';
import bcrypt from "bcryptjs";

const TransferScananyOr = () => {
    const qrRef = useRef(null);
    const fileInputRef = useRef(null);
    const [scanMode, setScanMode] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [allusers, setAllusers] = useState([]);
    const [usersData, setUsersData] = useState({});
    const [recentTransfers, setRecentTransfers] = useState([]);
    const { user, setUser } = useAuth();

    useEffect(() => {
        const allUsersDetails = async () => {
            try {
                setLoading(true);
                const res = await API.get("/auth/getAllUser");
                if (res.data.status === 'success') {
                    setAllusers(res.data.users);

                    // Convert array into object
                    const formattedUsers = {};
                    res.data.users.forEach((user) => {
                        formattedUsers[user.phone] = user.name;
                        formattedUsers[user.upiId] = user.name;
                    });
                    setUsersData(formattedUsers);

                } else {
                    setError(
                        err?.response?.data?.message ||
                        "Failed to load history"
                    );
                }
            } catch (error) {
                setError(
                    err?.response?.data?.message ||
                    "Failed to load history"
                );
            } finally {
                setLoading(false);
            }
        }
        allUsersDetails();
    }, []);

    useEffect(() => {
        const fetchUsersHistory = async () => {
            try {
                setLoading(true);
                const token = user?.token || localStorage.getItem("token");
                const res = await API.get("/transactions/history",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                if (res.data.status === 'success') {
                    setRecentTransfers(res.data.transactions);
                } else {
                    setError(
                        err?.response?.data?.message ||
                        "Failed to load history"
                    );
                }


            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                    "Failed to load history"
                );

            } finally {
                setLoading(false);
            }
        };
        fetchUsersHistory();
    }, [user]);


    // Transfer To Mobile Process Start
    const totalBalance = Number(user?.balance || 0);
    const [form, setForm] = useState({
        receiverIdentifier: '',
        name: '',
        amount: '',
        mpin: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Mobile / UPI Validation
        if (name === 'receiverIdentifier') {
            let cleaned = value;

            // If Mobile Number
            if (!value.includes('@')) {
                cleaned = value.replace(/\D/g, '');
                if (cleaned.length > 10) return;
            }

            // Auto Detect Receiver Name
            const receiverName = usersData[cleaned] || '';
            setForm((prev) => ({
                ...prev,
                receiverIdentifier: cleaned,
                name: receiverName,
            }));
            return;
        }

        // Amount Validation
        if (name === 'amount') {
            const cleaned = value.replace(/[^0-9.]/g, '');
            setForm((prev) => ({
                ...prev,
                amount: cleaned,
            }));
            return;
        }

        // MPIN Validation
        if (name === 'mpin') {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 4) {
                setForm((prev) => ({
                    ...prev,
                    mpin: cleaned,
                }));
            }
            return;
        }

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // CAMERA QR SCAN
    const startScanner = async () => {
        try {
            setError('');
            setSuccess('');
            setScanMode(true);
            const stream =
                await navigator.mediaDevices.getUserMedia({
                    video: {
                        facingMode: 'environment'
                    }
                });
            if (qrRef.current) {
                qrRef.current.srcObject = stream;
            }

        } catch (err) {
            console.log(err);
            setError('Camera permission denied');
        }
    };


    // STOP CAMERA
    const stopScanner = () => {
        setScanMode(false);
        const stream = qrRef.current?.srcObject;
        if (stream) {
            const tracks = stream.getTracks();
            tracks.forEach((track) =>
                track.stop()
            );
        }
    };


    // GALLERY QR SCAN
    const handleGalleryScan = async (e) => {
        try {
            setError('');
            setSuccess('');
            const file = e.target.files[0];
            if (!file) return;
            const image = new Image();
            image.src = URL.createObjectURL(file);
            image.onload = () => {
                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(
                    image,
                    0,
                    0,
                    image.width,
                    image.height
                );

                const imageData = context.getImageData(
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const code = jsQR(
                    imageData.data,
                    imageData.width,
                    imageData.height
                );

                if (code) {
                    const scannedData = code.data;
                    const receiverName = usersData[scannedData] || 'Scanned User';
                    setForm((prev) => ({
                        ...prev,
                        receiverIdentifier: scannedData,
                        name: receiverName,
                    }));
                    setSuccess('Gallery QR scanned successfully');
                } else {
                    setError('No QR code found in image');
                }
            };

        } catch (err) {
            console.log(err);
            setError('Failed to scan image');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        const currentBalance = parseFloat(user?.balance || 0);
        const addAmount = parseFloat(form.amount || 0);
        // Receiver Validation
        if (!form.receiverIdentifier.trim()) {
            return setError('Please enter mobile number or UPI');
        }

        // Receiver Exists
        if (!form.name.trim()) {
            return setError('Receiver not found');
        }

        // Amount Validation
        if (!form.amount || Number(form.amount) <= 0) {
            return setError('Please enter valid amount');
        }

        // MPIN Validation
        if (!form.mpin || form.mpin.length !== 4) {
            return setError('Please enter valid 4 digit MPIN');
        }

        try {
            setLoading(true);
            // Verify MPIN
            const isMatch = await bcrypt.compare(
                form.mpin,
                user.mpin
            );
            if (!isMatch) {
                setError('Invalid MPIN');
                setLoading(false);
                return;
            }

            // Final Payload
            const payload = {
                receiverIdentifier: form.receiverIdentifier,
                amount: Number(form.amount),
                mpin: form.mpin,
            };

            // API Request
            const token = user?.token || localStorage.getItem("token");
            const res = await API.post(
                '/transactions/send',
                payload,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const updatedBalance =
                res?.data?.newBalance !== undefined
                    ? Number(res.data.newBalance)
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

            setSuccess(
                res?.data?.message ||
                'Money transferred successfully'
            );

            // Reset Form
            setForm({
                receiverIdentifier: '',
                name: '',
                amount: '',
                mpin: '',
            });

        } catch (err) {
            setError(
                err?.response?.data?.message ||
                'Transfer failed'
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-100 to-indigo-100 p-4 md:p-8">
            <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* LEFT */}
                <div className="lg:col-span-2 bg-white rounded-3xl shadow-xl p-6 md:p-8">
                    {/* HEADER */}
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center">
                                <Smartphone className="w-8 h-8 text-purple-700" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Transfer / Scan QR</h1>
                                <p className="text-gray-500 mt-1">Send money instantly</p>
                            </div>
                        </div>

                        {/* SCAN BUTTON */}
                        <div className="flex flex-wrap gap-3">

                            {/* CAMERA QR */}
                            <button
                                type="button"
                                onClick={startScanner}
                                className="bg-purple-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-purple-800 transition-all"
                            >
                                <QrCode size={20} />
                                Scan QR
                            </button>

                            {/* GALLERY QR */}
                            <button
                                type="button"
                                onClick={() =>
                                    fileInputRef.current.click()
                                }
                                className="bg-indigo-700 text-white px-5 py-3 rounded-2xl flex items-center gap-2 hover:bg-indigo-800 transition-all"
                            >
                                <Camera size={20} />
                                Gallery Scan
                            </button>

                            {/* FILE INPUT */}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleGalleryScan}
                                className="hidden"
                            />

                        </div>
                    </div>

                    {/* ALERTS */}
                    {
                        error && (
                            <div className="bg-red-100 text-red-700 rounded-2xl p-4 mb-5">
                                {error}
                            </div>
                        )
                    }

                    {
                        success && (
                            <div className="bg-green-100 text-green-700 rounded-2xl p-4 mb-5 flex items-center gap-2">
                                <CheckCircle2 size={20} />
                                {success}
                            </div>
                        )
                    }

                    {/* QR SCANNER */}
                    {
                        scanMode && (

                            <div className="mb-6 bg-black rounded-3xl overflow-hidden relative">

                                {/* CAMERA */}
                                <video
                                    ref={qrRef}
                                    autoPlay
                                    playsInline
                                    className="w-full h-[320px] object-cover"
                                />

                                {/* SCAN BORDER */}
                                <div className="absolute inset-0 border-[3px] border-dashed border-white rounded-3xl m-8"></div>

                                {/* BUTTONS */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-3 flex-wrap">

                                    
                                    

                                    {/* CLOSE */}
                                    <button
                                        type="button"
                                        onClick={stopScanner}
                                        className="bg-red-600 text-white px-5 py-3 rounded-2xl flex items-center gap-2"
                                    >
                                        <XCircle size={18} />
                                        Close
                                    </button>

                                </div>

                            </div>

                        )
                    }

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Mobile / UPI */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">Mobile Number / UPI</label>
                            <div className="relative">
                                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="receiverIdentifier"
                                    value={form.receiverIdentifier}
                                    onChange={handleChange}
                                    placeholder="Enter mobile number or UPI"
                                    className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>

                        {/* Receiver Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Receiver Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    readOnly
                                    placeholder="Receiver name auto detected"
                                    className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-4 bg-gray-100 focus:outline-none"
                                />
                            </div>
                        </div>

                        {/* Amount */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Amount
                            </label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="text"
                                    name="amount"
                                    value={form.amount}
                                    onChange={handleChange}
                                    placeholder="Enter amount"
                                    className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>

                        {/* Note */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Note (Optional)
                            </label>
                            <textarea
                                rows="4"
                                name="note"
                                value={form.note}
                                onChange={handleChange}
                                placeholder="Write a note..."
                                className="w-full border border-gray-300 rounded-2xl px-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-600 resize-none"
                            />
                        </div>

                        {/* Quick Amount */}
                        <div>
                            <p className="text-sm font-semibold text-gray-700 mb-3">
                                Quick Amount
                            </p>

                            <div className="flex flex-wrap gap-3">
                                {[100, 500, 1000, 2000].map((amt) => (
                                    <button
                                        type="button"
                                        key={amt}
                                        onClick={() =>
                                            setForm({
                                                ...form,
                                                amount: amt.toString(),
                                            })
                                        }
                                        className="px-5 py-2 rounded-2xl bg-purple-100 text-purple-700 font-semibold hover:bg-purple-700 hover:text-white transition-all"
                                    >
                                        ₹ {amt}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* MPIN */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Enter MPIN
                            </label>

                            <div className="relative">
                                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                                <input
                                    type="password"
                                    name="mpin"
                                    maxLength="4"
                                    value={form.mpin}
                                    onChange={handleChange}
                                    placeholder="Enter 4 digit MPIN"
                                    className="w-full border border-gray-300 rounded-2xl pl-12 pr-4 py-4 focus:outline-none focus:ring-2 focus:ring-purple-600"
                                />
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-purple-700 to-indigo-700 hover:opacity-90 text-white py-4 rounded-2xl font-bold text-lg shadow-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            {loading ? 'Processing...' : 'Transfer Money'}
                        </button>
                    </form>
                </div>

                {/* Right Side */}
                <div className="space-y-6">
                    {/* Wallet Balance */}
                    <div className="bg-gradient-to-r from-purple-700 to-indigo-700 text-white rounded-3xl shadow-xl p-6">
                        <p className="text-sm opacity-80">
                            Available Balance
                        </p>

                        <h2 className="text-4xl font-bold mt-2">
                            {parseFloat(user?.balance || 0)}
                        </h2>

                        <div className="mt-6 flex items-center justify-between">
                            <div>
                                <p className="text-xs opacity-70">
                                    Wallet Status
                                </p>

                                <p className="font-semibold mt-1">
                                    Active
                                </p>
                            </div>

                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                                <IndianRupee className="w-6 h-6" />
                            </div>
                        </div>
                    </div>

                    {/* Recent Transfers */}
                    <div className="bg-white rounded-3xl shadow-xl p-6">
                        <div className="flex items-center justify-between mb-5">
                            <h3 className="text-xl font-bold text-gray-800">
                                Recent Transfers
                            </h3>

                            <Search className="w-5 h-5 text-gray-400" />
                        </div>

                        <div className="space-y-4 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100">
                            {recentTransfers.length > 0 ? (
                                recentTransfers
                                    .filter(
                                        (item) =>
                                            item.type === "TRANSFER" ||
                                            item.type === "WITHDRAW"
                                    )
                                    .map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center justify-between border border-gray-100 rounded-2xl p-4 hover:shadow-md transition-all"
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-lg">
                                                    {item.receiver.name.charAt(0)}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-800">
                                                        {item.receiver.name}
                                                    </p>

                                                    <p className="text-sm text-gray-500">
                                                        {item.receiver.phone}
                                                    </p>
                                                    <p className="text-sm text-gray-500">
                                                        {item.receiver.upiId}
                                                    </p>

                                                </div>
                                            </div>

                                            <div className="text-right">
                                                <p className="font-bold text-green-600">
                                                    ₹ {Number(item.amount).toFixed(2)}
                                                </p>

                                                <p className="text-xs text-gray-400 flex items-center gap-1 justify-end mt-1">
                                                    <Clock3 className="w-3 h-3" />
                                                    {new Date(item.createdAt || item.date).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                            ) : (

                                <div className="text-center p-6 text-gray-500">No transaction history found</div>
                            )}
                        </div>
                    </div>

                    {/* Safety Tips */}
                    <div className="bg-white rounded-3xl shadow-xl p-6">
                        <h3 className="text-xl font-bold text-gray-800 mb-4">
                            Safety Tips
                        </h3>

                        <ul className="space-y-3 text-sm text-gray-600">
                            <li className="flex gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Verify mobile number before transfer.
                            </li>

                            <li className="flex gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Never share your MPIN or OTP.
                            </li>

                            <li className="flex gap-2">
                                <CheckCircle2 className="w-5 h-5 text-green-500" />
                                Transactions are encrypted & secure.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TransferScananyOr;