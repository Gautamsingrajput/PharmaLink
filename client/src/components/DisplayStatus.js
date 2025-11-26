import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import StatusModal from './StatusModal.js';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contractConfig';

const DisplayStatus = () => {
  const [id, setId] = useState('');
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();

  const requestAccount = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found!");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };



  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const idParam = searchParams.get('id');
    if (idParam) {
      setId(idParam);
      // We need to call getStatus but since state updates are async, 
      // we should pass the id directly or use a separate effect.
      // Better approach: refactor getStatus to accept an optional ID argument.
      fetchStatus(idParam);
    }
  }, [location]);

  const fetchStatus = async (productId) => {
    if (!productId) return;
    setLoading(true);
    setData(null);
    try {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);
      const Sdata = await contract.getProductStatus(productId);
      console.log("Fetched status:", Sdata);
      setData(Sdata);
    } catch (error) {
      console.error("Error fetching status:", error);
      alert("Unable to fetch status. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  const getStatus = () => fetchStatus(id);

  const convertTimestamp = (t) => {
    try {
      const ts = parseInt(t?._hex || t, 16) * 1000;
      return new Date(ts).toLocaleString();
    } catch {
      return "Invalid timestamp";
    }
  };

  return (
    <div className="min-h-screen bg-background p-8 flex flex-col items-center">
      <div className="w-full max-w-3xl">
        <h2 className="text-3xl font-bold mb-8 text-center text-white">
          Track Shipment Status
        </h2>

        {/* Search Box */}
        <div className="bg-surface p-2 rounded-full border border-white/10 shadow-lg flex items-center max-w-md mx-auto mb-12">
          <input
            type="text"
            placeholder="Enter Product ID"
            className="flex-1 bg-transparent border-none outline-none text-white px-6 py-2 placeholder-gray-500"
            onChange={(e) => setId(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && getStatus()}
          />
          <button
            onClick={getStatus}
            className="bg-accent text-background p-3 rounded-full hover:bg-accent/90 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex flex-col items-center justify-center">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Fetching status history...</p>
          </div>
        ) : data && data.length > 0 ? (
          <div className="relative border-l-2 border-white/10 ml-4 md:ml-0 space-y-8">
            {data.map((row, index) => {
              const temp = parseInt(row[2], 10);
              const isSafe = temp < 25;

              return (
                <div key={index} className="relative pl-8 md:pl-0">
                  {/* Desktop Layout: Alternating sides could be done here, but keeping it simple left-aligned for now for consistency */}
                  <div className="md:flex items-center justify-between group">

                    {/* Timeline Dot */}
                    <div className="absolute -left-[9px] top-0 w-5 h-5 rounded-full border-4 border-background bg-accent shadow-[0_0_10px_#38bdf8]" />

                    {/* Content Card */}
                    <div className="bg-surface p-6 rounded-xl border border-white/10 hover:border-accent/30 transition-all shadow-lg w-full">
                      <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-white">{row[0]}</h3>
                        <span className="text-sm text-gray-400 font-mono mt-1 md:mt-0">
                          {convertTimestamp(row.timestamp?._hex)}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 mb-4">
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${isSafe ? 'bg-green-500/10 text-green-400' : 'bg-orange-500/10 text-orange-400'
                          }`}>
                          Temperature: {row[2]}
                        </div>
                      </div>

                      <div className="mt-2">
                        <StatusModal statusData={row} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          !loading && (
            <div className="text-center text-gray-500 mt-8">
              Enter a valid Product ID to view its journey.
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DisplayStatus;
