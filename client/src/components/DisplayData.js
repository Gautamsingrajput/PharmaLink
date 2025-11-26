import React, { useState } from 'react';
import { ethers } from "ethers";
import { CONTRACT_ADDRESS, CONTRACT_ABI } from "../config/contractConfig";

const DisplayData = () => {
  const [id, setId] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const requestAccount = async () => {
    if (window.ethereum) {
      await window.ethereum.request({ method: "eth_requestAccounts" });
    } else {
      alert("MetaMask not found!");
    }
  };

  const getData = async (silent = false) => {
    if (!id) {
      if (!silent) alert("Please enter Product ID");
      return;
    }

    if (!silent) setLoading(true);
    try {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const result = await contract.getProductData(id);

      console.log("Fetched Data:", result);
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (!silent) alert("Error fetching data from blockchain!");
    } finally {
      if (!silent) setLoading(false);
    }
  };

  React.useEffect(() => {
    let interval;
    if (id) {
      // Initial fetch is manual, this is for subsequent updates
      interval = setInterval(() => {
        getData(true);
      }, 5000); // Poll every 5 seconds
    }
    return () => clearInterval(interval);
  }, [id]);

  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center">
      <div className="w-full max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Environmental Data Log
        </h2>

        {/* Search Box */}
        <div className="bg-surface p-2 rounded-full border border-white/10 shadow-lg flex items-center max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Enter Product ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && getData()}
            className="flex-1 bg-transparent border-none outline-none text-white px-6 py-2 placeholder-gray-500"
          />
          <button
            onClick={() => getData(false)}
            className="bg-accent text-background p-3 rounded-full hover:bg-accent/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {loading && (
          <div className="flex flex-col items-center justify-center mb-8">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Retrieving sensor data...</p>
          </div>
        )}

        {data && Array.isArray(data) && data.length > 0 && (
          <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4">

            {/* Latest Data Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-surface p-6 rounded-xl border border-white/10 shadow-lg hover:border-accent/50 transition-colors">
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Current Temperature</h3>
                <div className="text-4xl font-bold text-white flex items-center gap-3">
                  <span>🌡️</span>
                  {parseInt(data[data.length - 1].temp._hex)}°C
                </div>
              </div>

              <div className="bg-surface p-6 rounded-xl border border-white/10 shadow-lg hover:border-accent/50 transition-colors">
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Current Humidity</h3>
                <div className="text-4xl font-bold text-white flex items-center gap-3">
                  <span>💧</span>
                  {parseInt(data[data.length - 1].humidity._hex)}%
                </div>
              </div>

              <div className="bg-surface p-6 rounded-xl border border-white/10 shadow-lg hover:border-accent/50 transition-colors">
                <h3 className="text-gray-400 text-sm uppercase tracking-wider mb-2">Current Heat Index</h3>
                <div className="text-4xl font-bold text-white flex items-center gap-3">
                  <span>☀️</span>
                  {parseInt(data[data.length - 1].hindex._hex)}°C
                </div>
              </div>
            </div>

            {/* History Table */}
            <div className="bg-surface rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="p-4 border-b border-white/10 bg-black/20">
                <h3 className="text-lg font-semibold text-white">History Log</h3>
              </div>
              <div className="overflow-x-auto max-h-96 overflow-y-auto">
                <table className="w-full text-left">
                  <thead className="sticky top-0 bg-surface z-10">
                    <tr className="bg-black/40 border-b border-white/10">
                      <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Sr. No.</th>
                      <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Temperature</th>
                      <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Humidity</th>
                      <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Heat Index</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {[...data].reverse().slice(1).map((row, i) => (
                      <tr key={i} className="hover:bg-white/5 transition-colors duration-200">
                        <td className="p-4 text-gray-400">{data.length - 1 - i}</td>
                        <td className="p-4 font-medium text-white">
                          <span className="flex items-center gap-2">
                            🌡️ {parseInt(row.temp._hex)}°C
                          </span>
                        </td>
                        <td className="p-4 font-medium text-white">
                          <span className="flex items-center gap-2">
                            💧 {parseInt(row.humidity._hex)}%
                          </span>
                        </td>
                        <td className="p-4 font-medium text-white">
                          <span className="flex items-center gap-2">
                            ☀️ {parseInt(row.hindex._hex)}°C
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {data.length <= 1 && (
                  <div className="p-8 text-center text-gray-500">
                    No historical data available yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayData;
