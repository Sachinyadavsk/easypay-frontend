import React, { useEffect, useState } from 'react';
import { useAuth } from '../shared/context/AuthContext';
import API from "../shared/api/axios";


const TransactionTable = () => {
  const { user } = useAuth();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch History
  useEffect(() => {
    const fetchHistory = async () => {
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
        console.log("history data", res.data.transactions);
        if (res.data.status === 'success') {
          setHistory(res.data.transactions);
          setSuccess(res.data.message);
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
    fetchHistory();
  }, [user]);

  return (
    <div className="overflow-x-auto bg-white rounded-3xl shadow-lg mt-10">
      <div className="max-w-7xl mx-auto">
        <table className="w-full min-w-[600px]">
          <thead className="bg-[#5F259F] text-white">
            <tr>
              <th className="p-4 text-left">Type</th>
              <th className="p-4 text-left">Transaction</th>
              <th className="p-4 text-left">Amount</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Date</th>
            </tr>
          </thead>
          <tbody>

            {history.length > 0 ? (
              history.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50 transition-all">
                  {/* Type */}
                  < td className="p-4" >
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-white font-bold ${item.type === "ADD_MONEY"
                        ? "bg-green-500"
                        : "bg-red-500"
                        }`}
                    >
                      {item.type === "ADD_MONEY" ? "+" : "-"}
                    </div>
                  </td>

                  {/* Transaction Name */}
                  <td className="p-4 font-medium">{item.type || item.billerName}</td>
                  {/* Amount */}
                  <td className={`p-4 font-semibold ${item.type === "ADD_MONEY" ? "text-green-600" : "text-red-600"}`}>
                    ₹ {Number(item.amount).toFixed(2)}
                  </td>

                  {/* Status */}
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${item.status === "SUCCESS"
                        ? "bg-green-100 text-green-700"
                        : item.status === "PENDING"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                        }`}
                    >
                      {item.status || "SUCCESS"}
                    </span>

                  </td>

                  {/* Date */}
                  <td className="p-4 text-gray-500">{new Date(item.createdAt || item.date).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center p-6 text-gray-500">No transaction history found</td>
              </tr>
            )}
          </tbody>
        </table >
      </div>
    </div >
  )
}

export default TransactionTable
