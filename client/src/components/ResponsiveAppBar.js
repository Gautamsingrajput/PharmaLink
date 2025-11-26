import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const pages = ['Home', 'Products', 'Workers', 'Status', 'Data', 'Admin'];

const ResponsiveAppBar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const location = useLocation();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } catch (error) {
        console.error("Error connecting wallet:", error);
      }
    } else {
      alert("MetaMask not found! Please install it.");
    }
  };

  useEffect(() => {
    const checkWallet = async () => {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_accounts" });
          if (accounts.length > 0) {
            setWalletAddress(accounts[0]);
          }
        } catch (error) {
          console.error("Error checking wallet:", error);
        }
      }
    };
    checkWallet();
  }, []);

  const formatAddress = (addr) => {
    return addr ? `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}` : "";
  };

  return (
    <nav className="bg-background/80 backdrop-blur-md border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">

          {/* Logo Section */}
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 overflow-hidden rounded-full border border-accent/20 shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <img
                src="/logo.gif"
                alt="PharmaLink Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hidden md:block">
              PharmaLink
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {pages.map((page) => {
              const path = `/${page.toLowerCase()}`;
              const isActive = location.pathname === path || (path === '/home' && location.pathname === '/');

              return (
                <Link
                  key={page}
                  to={path}
                  className={`relative px-3 py-2 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-accent' : 'text-gray-300 hover:text-white'
                    }`}
                >
                  {page}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 w-full h-0.5 bg-accent shadow-[0_0_10px_#38bdf8]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Wallet & Mobile Toggle */}
          <div className="flex items-center gap-4">
            {/* Wallet Button */}
            <button
              onClick={connectWallet}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 border ${walletAddress
                ? 'bg-accent/10 border-accent/50 text-accent hover:bg-accent/20'
                : 'bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white'
                }`}
            >
              <AccountBalanceWalletIcon fontSize="small" />
              {walletAddress ? formatAddress(walletAddress) : "Connect Wallet"}
            </button>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={toggleMobileMenu}
                className="p-2 rounded-md text-gray-300 hover:text-white hover:bg-white/5"
              >
                {isMobileMenuOpen ? <CloseIcon /> : <MenuIcon />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-surface border-b border-white/10 animate-in slide-in-from-top-5">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {pages.map((page) => (
              <Link
                key={page}
                to={`/${page.toLowerCase()}`}
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {page}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default ResponsiveAppBar;
