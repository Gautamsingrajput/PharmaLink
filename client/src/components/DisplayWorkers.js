import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { CONTRACT_ADDRESS } from "../config/contractConfig";
import SupplyChain from "../artifacts/contracts/SupplyChain.sol/Supplychain.json";

const DisplayWorkers = () => {
  const [workersList, setWorkersList] = useState([]);
  const [loading, setLoading] = useState(true);

  const ContractAddress = CONTRACT_ADDRESS;

  const requestAccount = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask to use this feature!");
      return false;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
    return true;
  };

  const getWorkers = async () => {
    try {
      const ok = await requestAccount();
      if (!ok) return;

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        ContractAddress,
        SupplyChain.abi,
        provider
      );

      const workers = await contract.getWorkerssList();
      console.log("✅ Raw workers data:", workers);

      if (Array.isArray(workers)) {
        const formatted = workers.map((w) => ({
          name: w.name || w[0],
          id: w.id ? Number(w.id) : Number(w[1]),
          timestamp: w.timestamp ? Number(w.timestamp) : Number(w[2]),
        }));
        setWorkersList(formatted);
      } else {
        setWorkersList([]);
      }
    } catch (err) {
      console.error("❌ Error fetching workers:", err);
      setWorkersList([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWorkers();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-white border-l-4 border-accent pl-4">
          Registered Workers
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Fetching worker data...</p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/40 border-b border-white/10">
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Sr. No.</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Name</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-right">Worker ID</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-right">Registered On</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {workersList.length > 0 ? (
                    workersList.map((row, index) => (
                      <tr
                        key={index}
                        className="hover:bg-white/5 transition-colors duration-200"
                      >
                        <td className="p-4 text-gray-400">{index + 1}</td>
                        <td className="p-4 font-medium text-white">{row.name}</td>
                        <td className="p-4 text-accent font-mono text-right">{row.id}</td>
                        <td className="p-4 text-gray-400 text-right">
                          {new Date(row.timestamp * 1000).toLocaleString()}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-8 text-center text-gray-500">
                        No workers found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayWorkers;
