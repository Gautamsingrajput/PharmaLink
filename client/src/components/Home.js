import React from "react";

const Home = () => {
  return (
    <div className="min-h-screen bg-background text-white selection:bg-accent/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-accent/20 rounded-full blur-3xl opacity-30 animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl opacity-30" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center relative z-10">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6">
            <span className="bg-gradient-to-r from-white via-gray-200 to-gray-400 bg-clip-text text-transparent">
              Blockchain & IoT Based
            </span>
            <br />
            <span className="text-accent drop-shadow-[0_0_15px_rgba(56,189,248,0.5)]">
              Pharma Supply Chain
            </span>
          </h1>

          <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-400 leading-relaxed">
            A live simulation platform demonstrating transparency, security, and traceability
            in the pharmaceutical industry using Web3 and IoT technology.
          </p>

          <div className="mt-10 flex justify-center gap-4">
            <a href="/products" className="px-8 py-3 rounded-full bg-accent text-background font-bold hover:bg-accent/90 transition-all shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:shadow-[0_0_30px_rgba(56,189,248,0.6)]">
              Explore Products
            </a>
            <a href="/status" className="px-8 py-3 rounded-full border border-white/20 hover:bg-white/5 transition-all backdrop-blur-sm">
              Track Shipment
            </a>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center mb-16">
          <span className="border-b-4 border-accent pb-2">How It Works</span>
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="group p-8 rounded-2xl bg-surface border border-white/5 hover:border-accent/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-14 h-14 rounded-xl bg-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/20 transition-colors">
              <span className="text-2xl">🌡️</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">IoT Monitoring</h3>
            <p className="text-gray-400 leading-relaxed">
              Environmental parameters such as temperature and humidity are collected using IoT sensors
              and transmitted via <a href="https://nodered.org/" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Node-RED</a>.
            </p>
          </div>

          {/* Step 2 */}
          <div className="group p-8 rounded-2xl bg-surface border border-white/5 hover:border-accent/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center mb-6 group-hover:bg-purple-500/20 transition-colors">
              <span className="text-2xl">🔗</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Blockchain Recording</h3>
            <p className="text-gray-400 leading-relaxed">
              Sensor data is sent to a FastAPI service, interacting with smart contracts through
              <span className="font-semibold text-white"> Web3.py</span> to securely record transactions on Ethereum.
            </p>
          </div>

          {/* Step 3 */}
          <div className="group p-8 rounded-2xl bg-surface border border-white/5 hover:border-accent/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
            <div className="w-14 h-14 rounded-xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:bg-green-500/20 transition-colors">
              <span className="text-2xl">📊</span>
            </div>
            <h3 className="text-xl font-bold mb-4 text-white">Live Visualization</h3>
            <p className="text-gray-400 leading-relaxed">
              This web interface visualizes live data — including product details, shipment status,
              and environmental conditions — providing end-to-end transparency.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
