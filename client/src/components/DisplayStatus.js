import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import StatusModal from './StatusModal.js';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contractConfig';

const DisplayStatus = () => {
  const [id, setId] = useState('');
  const [data, setData] = useState(null);
  const [productInfo, setProductInfo] = useState(null);
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
      const Pdata = await contract.products(productId);
      console.log("Fetched status:", Sdata);
      console.log("Fetched product info:", Pdata);
      setData(Sdata);
      setProductInfo(Pdata);
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
          <div className="relative border-l-4 border-white/10 ml-6 md:ml-10 space-y-12 pb-12">
            {/* Product Header Info */}
            {productInfo && (
              <div className="mb-12 bg-surface p-6 rounded-xl border border-white/10 shadow-lg -ml-6 md:-ml-10 w-[calc(100%+24px)] md:w-[calc(100%+40px)]">
                <h3 className="text-2xl font-bold text-white mb-2">{productInfo.name}</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-400">Required Temp:</span>
                    <span className="ml-2 text-accent font-mono">{productInfo.reqtemp}°C</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Price:</span>
                    <span className="ml-2 text-green-400">₹{productInfo.price}</span>
                  </div>
                </div>
              </div>
            )}

            {data.map((row, index) => {
              const temp = parseInt(row[2], 10);
              const reqTemp = productInfo ? parseInt(productInfo.reqtemp, 10) : 25; // Default to 25 if not found
              const isSafe = temp <= reqTemp;

              return (
                <div key={index} className="relative pl-8 md:pl-12">
                  {/* Chain Connector Line */}
                  <div className={`absolute -left-[11px] top-8 w-6 h-1 ${isSafe ? 'bg-green-500' : 'bg-red-500'} transition-colors duration-500`} />

                  {/* Timeline Node */}
                  <div className={`absolute -left-[21px] top-6 w-10 h-10 rounded-full border-4 border-background flex items-center justify-center shadow-[0_0_15px_rgba(0,0,0,0.5)] z-10 ${isSafe ? 'bg-green-500 shadow-green-500/50' : 'bg-red-500 shadow-red-500/50 animate-pulse'
                    }`}>
                    {isSafe ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>

                  {/* Content Card */}
                  <div className={`bg-surface p-6 rounded-xl border transition-all shadow-lg w-full group hover:scale-[1.02] duration-300 ${isSafe ? 'border-white/10 hover:border-green-500/30' : 'border-red-500/50 hover:border-red-500 shadow-red-900/20'
                    }`}>
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-2">
                          {row[0]}
                          {!isSafe && (
                            <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-500 text-white animate-pulse">
                              UNSAFE
                            </span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-400 mt-1">Location Update</p>
                      </div>
                      <span className="text-sm text-gray-400 font-mono bg-black/30 px-3 py-1 rounded-lg border border-white/5 mt-2 md:mt-0">
                        {convertTimestamp(row.timestamp?._hex)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className={`p-3 rounded-lg border ${isSafe ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/10 border-red-500/30'}`}>
                        <span className="text-xs text-gray-400 block mb-1">Temperature</span>
                        <span className={`text-lg font-mono font-bold ${isSafe ? 'text-green-400' : 'text-red-400'}`}>
                          {row[2]}°C
                        </span>
                        {!isSafe && <span className="text-xs text-red-400 block mt-1">Exceeded {productInfo?.reqtemp}°C</span>}
                      </div>

                      <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                        <span className="text-xs text-gray-400 block mb-1">Humidity</span>
                        <span className="text-lg font-mono text-blue-400">{row[3]}%</span>
                      </div>

                      <div className="p-3 rounded-lg border border-white/10 bg-white/5">
                        <span className="text-xs text-gray-400 block mb-1">Heat Index</span>
                        <span className="text-lg font-mono text-orange-400">{row[4]}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-white/10 flex justify-end">
                      <StatusModal statusData={row} />
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
