import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contractConfig';

// Polygon Amoy Testnet RPC
const RPC_URL = "https://rpc-amoy.polygon.technology/";

const MobileTracking = () => {
    const [product, setProduct] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            const searchParams = new URLSearchParams(location.search);
            const id = searchParams.get('id');

            if (!id) {
                setError("No product ID provided.");
                setLoading(false);
                return;
            }

            try {
                // Connect to RPC Provider (Read-only, no wallet needed)
                const provider = new ethers.providers.JsonRpcProvider(RPC_URL);
                const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider);

                // Fetch Product Details from 'products' mapping
                // Mapping signature: mapping (uint256 => Product) public products;
                const productData = await contract.products(id);

                // Fetch Status History
                const statusData = await contract.getProductStatus(id);

                // Parse Product Data (Struct: id, name, price, description, reqtemp, manufacturing, timestamp)
                // Ethers returns an array-like object. We use indices to be safe.
                setProduct({
                    id: productData[0],
                    name: productData[1],
                    price: productData[2],
                    description: productData[3],
                    reqtemp: productData[4],
                    mfg: productData[5],
                    timestamp: productData[6]
                });
                setHistory(statusData);
            } catch (err) {
                console.error("Blockchain Error:", err);
                setError("Unable to load tracking data from blockchain. Please try again.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [location]);

    const convertTimestamp = (t) => {
        try {
            const ts = t && t._hex ? parseInt(t._hex, 16) : parseInt(t);
            if (isNaN(ts)) return "Invalid Date";
            return new Date(ts * 1000).toLocaleString();
        } catch {
            return "Invalid Date";
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-900 flex flex-col items-center justify-center text-white">
                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
                <p>Loading shipment details from Blockchain...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
                <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-6 text-center max-w-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <h3 className="text-xl font-bold text-white mb-2">Error</h3>
                    <p className="text-gray-300">{error}</p>
                </div>
            </div>
        );
    }

    const isShipmentCancelled = history.some(row => {
        const temp = parseInt(row.temp || row[2]);
        const reqTemp = parseInt(product.reqtemp);
        return temp > reqTemp;
    });

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans pb-12">
            {/* Header */}
            <div className="bg-gray-800 p-6 shadow-lg border-b border-gray-700 sticky top-0 z-20">
                <h1 className="text-xl font-bold text-blue-400">PharmaTrack</h1>
                <p className="text-xs text-gray-400 mt-1">Blockchain Verified Supply Chain</p>
            </div>

            <div className="p-4 max-w-md mx-auto">
                {/* Product Card */}
                <div className={`rounded-2xl p-6 mb-8 shadow-xl border ${isShipmentCancelled ? 'bg-red-900/20 border-red-500' : 'bg-gray-800 border-gray-700'
                    }`}>
                    <div className="flex justify-between items-start mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">{product.name}</h2>
                            <p className="text-sm text-gray-400">ID: {parseInt(product.id._hex || product.id)}</p>
                        </div>
                        {isShipmentCancelled ? (
                            <div className="bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold border border-red-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                                CANCELLED
                            </div>
                        ) : (
                            <div className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-xs font-bold border border-blue-500/30">
                                VERIFIED
                            </div>
                        )}
                    </div>

                    {isShipmentCancelled && (
                        <div className="mb-4 bg-red-500/10 border border-red-500/50 p-3 rounded-lg flex items-start gap-3">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <div>
                                <p className="text-red-400 font-bold text-sm">Shipment Cancelled</p>
                                <p className="text-red-300/80 text-xs mt-1">
                                    Temperature limits were exceeded during transit. This product is unsafe for use.
                                </p>
                            </div>
                        </div>
                    )}

                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span className="text-gray-400">Price</span>
                            <span className="font-mono text-green-400">₹{product.price}</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-700 pb-2">
                            <span className="text-gray-400">Required Temp</span>
                            <span className="font-mono text-orange-400">{product.reqtemp}°C</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-400">Mfg Date</span>
                            <span>{product.mfg}</span>
                        </div>
                    </div>
                </div>

                {/* Timeline */}
                <h3 className="text-lg font-bold mb-6 pl-2 border-l-4 border-blue-500">Shipment Journey</h3>

                <div className="space-y-8 relative pl-4">
                    {/* Vertical Line */}
                    <div className="absolute left-[27px] top-4 bottom-4 w-0.5 bg-gray-700" />

                    {history.map((row, index) => {
                        const temp = parseInt(row[2]);
                        const reqTemp = parseInt(product.reqtemp);
                        const isSafe = temp <= reqTemp;

                        return (
                            <div key={index} className="relative pl-12">
                                {/* Node Dot */}
                                <div className={`absolute left-4 top-0 w-6 h-6 rounded-full border-4 border-gray-900 z-10 shadow-lg ${isSafe ? 'bg-green-500' : 'bg-red-500 animate-pulse'
                                    }`} />

                                {/* Card */}
                                <div className={`bg-gray-800 rounded-xl p-4 border shadow-lg ${isSafe ? 'border-gray-700' : 'border-red-500/50 bg-red-900/10'
                                    }`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="font-bold text-white">{row[0]}</h4>
                                        <span className="text-xs text-gray-400 bg-black/20 px-2 py-1 rounded">
                                            {convertTimestamp(row[1])}
                                        </span>
                                    </div>

                                    {!isSafe && (
                                        <div className="mb-3 bg-red-500/20 text-red-400 text-xs px-3 py-2 rounded-lg flex items-center gap-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                            Temperature Exceeded Limit!
                                        </div>
                                    )}

                                    <div className="grid grid-cols-3 gap-2 text-center">
                                        <div className={`p-2 rounded-lg ${isSafe ? 'bg-gray-700/50' : 'bg-red-500/10'}`}>
                                            <div className="text-[10px] text-gray-400 uppercase">Temp</div>
                                            <div className={`font-mono font-bold ${isSafe ? 'text-green-400' : 'text-red-400'}`}>
                                                {row[2]}°C
                                            </div>
                                        </div>
                                        <div className="bg-gray-700/50 p-2 rounded-lg">
                                            <div className="text-[10px] text-gray-400 uppercase">Humidity</div>
                                            <div className="font-mono text-blue-400">{row[3]}%</div>
                                        </div>
                                        <div className="bg-gray-700/50 p-2 rounded-lg">
                                            <div className="text-[10px] text-gray-400 uppercase">Heat Idx</div>
                                            <div className="font-mono text-orange-400">{row[4]}</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default MobileTracking;
