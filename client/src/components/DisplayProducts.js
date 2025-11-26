import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contractConfig';

const DisplayProducts = () => {
  const [products, setProducts] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestAccount = async () => {
    if (!window.ethereum) {
      alert("MetaMask not found!");
      return;
    }
    await window.ethereum.request({ method: "eth_requestAccounts" });
  };

  const getProducts = async () => {
    try {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

      const data = await contract.getProducts();
      console.log("Products:", data);
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
      alert("Failed to fetch products. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-white border-l-4 border-accent pl-4">
          Product Inventory
        </h2>

        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-400">Loading inventory...</p>
          </div>
        ) : !products || products.length === 0 ? (
          <div className="text-center py-20 bg-surface rounded-xl border border-white/10">
            <p className="text-gray-400 text-lg">No products found in the supply chain.</p>
          </div>
        ) : (
          <div className="bg-surface rounded-xl border border-white/10 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-black/40 border-b border-white/10">
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Sr. No.</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Product Name</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">ID</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Description</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Price</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Req. Temp</th>
                    <th className="p-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Mfg Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {products.map((row, i) => (
                    <tr key={i} className="hover:bg-white/5 transition-colors duration-200">
                      <td className="p-4 text-gray-400">{i + 1}</td>
                      <td className="p-4 font-medium text-white">{row[1]}</td>
                      <td className="p-4 text-accent font-mono">{parseInt(row[0]._hex)}</td>
                      <td className="p-4 text-gray-300 max-w-xs truncate" title={row[3]}>{row[3]}</td>
                      <td className="p-4 text-green-400 font-medium">₹{row[2]}</td>
                      <td className="p-4 text-orange-400">{row[4]}</td>
                      <td className="p-4 text-gray-400">{row[5]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DisplayProducts;
