import React, { useState } from 'react';

export default function StatusModal({ statusData }) {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  function convertTimestamp(hexTime) {
    if (!hexTime) return "N/A";
    const intTimestamp = parseInt(hexTime, 16);
    if (isNaN(intTimestamp) || intTimestamp === 0) return "Invalid timestamp";
    const date = new Date(intTimestamp * 1000);
    return date.toLocaleString();
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="text-sm text-accent hover:text-white underline decoration-accent/50 hover:decoration-white transition-all"
      >
        View Details
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-white/10 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in zoom-in-95 duration-200">

            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center">
              <h3 className="text-xl font-bold text-white">
                {statusData ? statusData[0] : "Status Details"}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              {statusData ? (
                <div className="space-y-3 text-gray-300">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Temperature</span>
                    <span className="font-mono text-white">{statusData[2] ? `${statusData[2]}` : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Recorded At</span>
                    <span className="font-mono text-white text-right">{convertTimestamp(statusData.timestamp?._hex)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Humidity</span>
                    <span className="font-mono text-white">{statusData.humidity ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Heat Index</span>
                    <span className="font-mono text-white">{statusData.heatindex ?? "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Product ID</span>
                    <span className="font-mono text-white">{statusData.p_id ? parseInt(statusData.p_id._hex) : "N/A"}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Quantity</span>
                    <span className="font-mono text-white">{statusData.total_quantity ? parseInt(statusData.total_quantity._hex) : "N/A"} Units</span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="w-8 h-8 border-2 border-accent border-t-transparent rounded-full animate-spin mb-2"></div>
                  <p className="text-gray-500">Loading details...</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-4 bg-black/20 border-t border-white/10 flex justify-end">
              <button
                onClick={handleClose}
                className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white text-sm font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
