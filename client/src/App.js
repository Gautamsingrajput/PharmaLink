import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home.js";
import ResponsiveAppBar from "./components/ResponsiveAppBar.js";
import Footer from "./components/Footer.js";
import DisplayProducts from "./components/DisplayProducts.js";
import DisplayWorkers from "./components/DisplayWorkers.js";
import DisplayStatus from "./components/DisplayStatus.js";
import DisplayData from "./components/DisplayData.js";
import AdminPortal from "./components/AdminPortal.js";
import MobileTracking from "./components/MobileTracking.js";

function App() {
  return (
    <div className="min-h-screen bg-background text-white font-sans flex flex-col">
      <BrowserRouter>
        <ResponsiveAppBar />

        <div className="w-full flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Navigate replace to="/" />} />
            <Route path="/workers" element={<DisplayWorkers />} />
            <Route path="/products" element={<DisplayProducts />} />
            <Route path="/status" element={<DisplayStatus />} />
            <Route path="/data" element={<DisplayData />} />
            <Route path="/admin" element={<AdminPortal />} />
            <Route path="/track" element={<MobileTracking />} />
          </Routes>
        </div>

        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;