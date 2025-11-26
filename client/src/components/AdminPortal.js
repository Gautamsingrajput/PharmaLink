import React, { useState } from 'react';
import { ethers } from 'ethers';
import { CONTRACT_ADDRESS, CONTRACT_ABI } from '../config/contractConfig';

const AdminPortal = () => {
    const [activeTab, setActiveTab] = useState('product');
    const [loading, setLoading] = useState(false);

    // Form States
    const [productForm, setProductForm] = useState({
        name: '', price: '', description: '', reqtemp: '', manufacturing: ''
    });
    const [workerForm, setWorkerForm] = useState({ name: '' });
    const [statusForm, setStatusForm] = useState({
        id: '', location: '', temp: '', humidity: '', heatindex: '', wid: '', total_quantity: '', flag: false
    });
    const [dataForm, setDataForm] = useState({
        pid: '', temp: '', humidity: '', heatindex: ''
    });

    const requestAccount = async () => {
        if (!window.ethereum) throw new Error("MetaMask not found!");
        await window.ethereum.request({ method: "eth_requestAccounts" });
    };

    const getContract = async () => {
        await requestAccount();
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        return new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const contract = await getContract();
            const tx = await contract.AddProduct(
                productForm.name,
                productForm.price,
                productForm.description,
                productForm.reqtemp,
                productForm.manufacturing
            );
            await tx.wait();
            alert("Product Added Successfully!");
            setProductForm({ name: '', price: '', description: '', reqtemp: '', manufacturing: '' });
        } catch (err) {
            console.error(err);
            alert("Error adding product: " + err.message);
        }
        setLoading(false);
    };

    const handleAddWorker = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const contract = await getContract();
            const tx = await contract.setWorker(workerForm.name);
            await tx.wait();
            alert("Worker Added Successfully!");
            setWorkerForm({ name: '' });
        } catch (err) {
            console.error(err);
            alert("Error adding worker: " + err.message);
        }
        setLoading(false);
    };

    const handleAddStatus = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const contract = await getContract();
            const tx = await contract.AddStatus(
                statusForm.location,
                statusForm.temp,
                statusForm.humidity,
                statusForm.heatindex,
                statusForm.wid,
                statusForm.id,
                statusForm.total_quantity,
                statusForm.flag
            );
            await tx.wait();
            alert("Status Updated Successfully!");
            setStatusForm({ id: '', location: '', temp: '', humidity: '', heatindex: '', wid: '', total_quantity: '', flag: false });
        } catch (err) {
            console.error(err);
            alert("Error updating status: " + err.message);
        }
        setLoading(false);
    };

    const handleAddData = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const contract = await getContract();
            const tx = await contract.AddData(
                dataForm.temp,
                dataForm.humidity,
                dataForm.heatindex,
                dataForm.pid
            );
            await tx.wait();
            alert("Data Added Successfully!");
            setDataForm({ pid: '', temp: '', humidity: '', heatindex: '' });
        } catch (err) {
            console.error(err);
            alert("Error adding data: " + err.message);
        }
        setLoading(false);
    };

    const inputClass = "w-full bg-black/20 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-accent transition-colors";
    const labelClass = "block text-sm font-medium text-gray-400 mb-1";
    const btnClass = "w-full bg-accent text-background font-bold py-3 rounded-lg hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed";

    return (
        <div className="min-h-screen bg-background p-8">
            <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold mb-8 text-white border-l-4 border-accent pl-4">
                    Admin Portal
                </h2>

                {/* Tabs */}
                <div className="flex flex-wrap gap-4 mb-8">
                    {['product', 'worker', 'status', 'data'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-6 py-2 rounded-full capitalize font-medium transition-all ${activeTab === tab
                                    ? 'bg-accent text-background shadow-[0_0_15px_rgba(56,189,248,0.4)]'
                                    : 'bg-surface border border-white/10 text-gray-400 hover:bg-white/5'
                                }`}
                        >
                            Add {tab}
                        </button>
                    ))}
                </div>

                {/* Forms Container */}
                <div className="bg-surface rounded-xl border border-white/10 p-8 shadow-2xl">

                    {/* Add Product Form */}
                    {activeTab === 'product' && (
                        <form onSubmit={handleAddProduct} className="space-y-6">
                            <h3 className="text-xl font-bold text-white mb-4">Register New Product</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Product Name</label>
                                    <input type="text" className={inputClass} value={productForm.name} onChange={e => setProductForm({ ...productForm, name: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Price (INR)</label>
                                    <input type="text" className={inputClass} value={productForm.price} onChange={e => setProductForm({ ...productForm, price: e.target.value })} required />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClass}>Description</label>
                                    <textarea className={inputClass} rows="3" value={productForm.description} onChange={e => setProductForm({ ...productForm, description: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Required Temp</label>
                                    <input type="text" className={inputClass} value={productForm.reqtemp} onChange={e => setProductForm({ ...productForm, reqtemp: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Manufacturing Date</label>
                                    <input type="date" className={inputClass} value={productForm.manufacturing} onChange={e => setProductForm({ ...productForm, manufacturing: e.target.value })} required />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className={btnClass}>
                                {loading ? 'Processing...' : 'Register Product'}
                            </button>
                        </form>
                    )}

                    {/* Add Worker Form */}
                    {activeTab === 'worker' && (
                        <form onSubmit={handleAddWorker} className="space-y-6">
                            <h3 className="text-xl font-bold text-white mb-4">Register New Worker</h3>
                            <div>
                                <label className={labelClass}>Worker Name</label>
                                <input type="text" className={inputClass} value={workerForm.name} onChange={e => setWorkerForm({ ...workerForm, name: e.target.value })} required />
                            </div>
                            <button type="submit" disabled={loading} className={btnClass}>
                                {loading ? 'Processing...' : 'Register Worker'}
                            </button>
                        </form>
                    )}

                    {/* Add Status Form */}
                    {activeTab === 'status' && (
                        <form onSubmit={handleAddStatus} className="space-y-6">
                            <h3 className="text-xl font-bold text-white mb-4">Update Shipment Status</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Product ID</label>
                                    <input type="number" className={inputClass} value={statusForm.id} onChange={e => setStatusForm({ ...statusForm, id: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Worker ID</label>
                                    <input type="number" className={inputClass} value={statusForm.wid} onChange={e => setStatusForm({ ...statusForm, wid: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Location</label>
                                    <input type="text" className={inputClass} value={statusForm.location} onChange={e => setStatusForm({ ...statusForm, location: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Total Quantity</label>
                                    <input type="number" className={inputClass} value={statusForm.total_quantity} onChange={e => setStatusForm({ ...statusForm, total_quantity: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Temperature</label>
                                    <input type="text" className={inputClass} value={statusForm.temp} onChange={e => setStatusForm({ ...statusForm, temp: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Humidity</label>
                                    <input type="text" className={inputClass} value={statusForm.humidity} onChange={e => setStatusForm({ ...statusForm, humidity: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Heat Index</label>
                                    <input type="text" className={inputClass} value={statusForm.heatindex} onChange={e => setStatusForm({ ...statusForm, heatindex: e.target.value })} required />
                                </div>
                                <div className="flex items-center gap-2 mt-6">
                                    <input type="checkbox" id="flag" className="w-5 h-5 accent-accent" checked={statusForm.flag} onChange={e => setStatusForm({ ...statusForm, flag: e.target.checked })} />
                                    <label htmlFor="flag" className="text-white">Shipment Completed?</label>
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className={btnClass}>
                                {loading ? 'Processing...' : 'Update Status'}
                            </button>
                        </form>
                    )}

                    {/* Add Data Form */}
                    {activeTab === 'data' && (
                        <form onSubmit={handleAddData} className="space-y-6">
                            <h3 className="text-xl font-bold text-white mb-4">Log IoT Sensor Data</h3>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className={labelClass}>Product ID</label>
                                    <input type="number" className={inputClass} value={dataForm.pid} onChange={e => setDataForm({ ...dataForm, pid: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Temperature</label>
                                    <input type="number" className={inputClass} value={dataForm.temp} onChange={e => setDataForm({ ...dataForm, temp: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Humidity</label>
                                    <input type="number" className={inputClass} value={dataForm.humidity} onChange={e => setDataForm({ ...dataForm, humidity: e.target.value })} required />
                                </div>
                                <div>
                                    <label className={labelClass}>Heat Index</label>
                                    <input type="number" className={inputClass} value={dataForm.heatindex} onChange={e => setDataForm({ ...dataForm, heatindex: e.target.value })} required />
                                </div>
                            </div>
                            <button type="submit" disabled={loading} className={btnClass}>
                                {loading ? 'Processing...' : 'Log Data'}
                            </button>
                        </form>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AdminPortal;
